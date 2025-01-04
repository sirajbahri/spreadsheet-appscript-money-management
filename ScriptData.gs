function BukaFormData() {
  var html = HtmlService.createHtmlOutputFromFile("FormData")
  .setWidth(350)
  .setHeight(500)
  SpreadsheetApp.getUi().showModalDialog(html,"PENGELOLA KEUANGAN")
}

//mengisi fungsi awal
function inputData(jumlah, tanggal, waktu, tipe, kategori, modePembayaran, pembayaran, detail, status, buktiPembayaran) {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName("DATA");
  var lastRow = sheet.getLastRow();
  sheet.appendRow([tanggal, waktu, tipe, kategori, jumlah, modePembayaran, pembayaran, detail, status, buktiPembayaran]);
}

//Sidebar
function showSidebar() {
  const html = HtmlService.createHtmlOutputFromFile('FormData')
    .setTitle('Pengelola Keuangan')
    .setWidth(300); // Sidebar memiliki lebar default 300px
  SpreadsheetApp.getUi().showSidebar(html);
}
//sidebar
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Keuangan')
    .addItem('Buka Formulir', 'showSidebar')
    .addToUi();
}

//WebApp
function doGet() {
  return HtmlService.createHtmlOutputFromFile('FormData')
    .setSandboxMode(HtmlService.SandboxMode.IFRAME);
}



