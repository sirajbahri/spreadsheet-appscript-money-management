// Konfigurasi
const SPREADSHEET_ID = 'ID_SPREADSHEET';
const SHEET_NAME = 'Sheet1';
const FOLDER_NAME = 'NAMA_FOLDER'; // Nama folder di Drive

// Fungsi untuk mendapatkan atau membuat folder
function getOrCreateFolder() {
  const folderName = FOLDER_NAME;
  const folders = DriveApp.getFoldersByName(folderName);
  
  if (folders.hasNext()) {
    return folders.next();
  } else {
    return DriveApp.createFolder(folderName);
  }
}

// Fungsi untuk menyimpan file ke Drive
function saveFileToDrive(base64Data, fileName, mimeType) {
  // Decode base64
  const blob = Utilities.newBlob(Utilities.base64Decode(base64Data), mimeType, fileName);
  
  // Mendapatkan folder
  const folder = getOrCreateFolder();
  
  // Menyimpan file
  const file = folder.createFile(blob);
  
  // Membuat file dapat diakses siapa saja dengan link
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  
  return {
    fileId: file.getId(),
    fileUrl: file.getUrl()
  };
}

// Fungsi untuk menangani POST request dari form
function doPost(e) {
  try {
    // Parse form data
    const formData = JSON.parse(e.parameter.formData);
    
    // Mendapatkan file data jika ada
    let fileUrl = '';
    if (e.parameter.fileContent && e.parameter.fileName && e.parameter.mimeType) {
      const fileInfo = saveFileToDrive(
        e.parameter.fileContent,
        e.parameter.fileName,
        e.parameter.mimeType
      );
      fileUrl = fileInfo.fileUrl;
    }
    
    // Mendapatkan spreadsheet dan sheet yang aktif
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);
    
    // Mendapatkan timestamp
    const timestamp = new Date();
    
    // Menyiapkan data untuk dimasukkan ke spreadsheet
    const rowData = [
      timestamp,                    // Timestamp
      formData.jumlah,             // Jumlah
      formData.tanggal,            // Tanggal
      formData.waktu,              // Waktu
      formData.tipe,               // Tipe
      formData.kategori,           // Kategori
      formData.subkategori,        // Subkategori (baru)
      formData.modePembayaran,     // Mode Pembayaran
      formData.pembayaran,         // Pembayaran
      formData.nama,               // Nama (baru)
      formData.detail,             // Detail
      formData.status,             // Status
      fileUrl                      // URL file di Drive
    ];
    
    // Menambahkan data ke spreadsheet
    sheet.appendRow(rowData);
    
    // Mengembalikan response sukses
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'success',
      'message': 'Data berhasil disimpan',
      'fileUrl': fileUrl
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Mengembalikan response error
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'error',
      'message': error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
