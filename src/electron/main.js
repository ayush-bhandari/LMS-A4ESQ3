const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win
let knex = require("knex")({
  client: "sqlite3",
  connection: {
    filename: path.join(__dirname, '../DB/', 'database.sqlite')
  },
  useNullAsDefault: true
});

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({ icon:__dirname+'/assets/lims.png', show:false })
  mainWindow.maximize();
  
  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  mainWindow.once("ready-to-show", () => { mainWindow.show() })

// Database Queries EVENTS

  // Students Database Queries

  ipcMain.on("studentsRead", function () {
    knex.select().from("Students").then(function (students) {
      mainWindow.webContents.send("studentsReadResult", students);
    })
  });

  ipcMain.on("studentsCreate", function (evt, student) {
    knex('Students').where('member_id', student.member_id).then((studentResult)=>{
      if (studentResult.length === 0){
        knex('Students').insert({
          member_id: student.member_id,
          student_name: student.student_name,
          student_class: student.student_class,
          student_rollno: student.student_rollno,
          created_date: student.created_date,
          modified_date: student.modified_date
         }).then(()=>{
          mainWindow.webContents.send("studentsCreateResult");
        })
      }else{
        mainWindow.webContents.send("studentAlreadyExists");
      }
    })
    
  });
  
  ipcMain.on("studentEdit", function (evt, student) {
    knex('Students').where('member_id', student.member_id).update({
      student_name: student.student_name,
      student_class: student.student_class,
      student_rollno: student.student_rollno,
      modified_date: student.modified_date
    }).then(()=>{
      mainWindow.webContents.send("studentEditResult");
    })
  });
  
  ipcMain.on("studentsDelete", function (evt,student) {
    knex("Students").where('member_id', student.member_id).del().then(()=>{
      mainWindow.webContents.send("studentsDeleteResult");
    })
  });

    // Books Database Queries

  ipcMain.on("booksRead", function () {
    knex.select().from("Books").then(function (books) {
      mainWindow.webContents.send("booksReadResult", books);
    })
  });

  ipcMain.on("bookCreate", function (evt, book) {
    knex('Books').where('book_id', book.book_id).then((bookResult)=>{
      if (bookResult.length === 0){
        knex('Books').insert({
          book_id: book.book_id,
          book_title: book.book_title,
          book_author: book.book_author,
          book_isbn: book.book_isbn,
          book_category: book.book_category,
          book_language: book.book_language,
          book_publisher: book.book_publisher,
          book_year: book.book_year,
          book_price: book.book_price,
          book_pages: book.book_pages,
          book_shelf: book.book_shelf,
          created_date: book.created_date,
          modified_date: book.modified_date
         }).then(()=>{
          mainWindow.webContents.send("bookCreateResult");
        })
      }else{
        mainWindow.webContents.send("bookAlreadyExists");
      }
    })
    
  });
  
  ipcMain.on("bookEdit", function (evt, book) {
    knex('Books').where('book_id', book.book_id).update({
      book_title: book.book_title,
      book_author: book.book_author,
      book_isbn: book.book_isbn,
      book_category: book.book_category,
      book_language: book.book_language,
      book_publisher: book.book_publisher,
      book_year: book.book_year,
      book_price: book.book_price,
      book_pages: book.book_pages,
      book_shelf: book.book_shelf,
      modified_date: book.modified_date
    }).then(()=>{
      mainWindow.webContents.send("bookEditResult");
    })
  });
  
  ipcMain.on("bookDelete", function (evt,book) {
    knex("Books").where('book_id', book.book_id).del().then(()=>{
      mainWindow.webContents.send("bookDeleteResult");
    })
  });


  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})