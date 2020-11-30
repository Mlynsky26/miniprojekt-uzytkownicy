var express = require("express")
var app = express()
var PORT = process.env.PORT || 3000;
var path = require("path")
var bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({ extended: true }));

var users =[
    {id: 0, login: "aaa", haslo: "AAA", wiek: 13, uczen: "checked", plec: "m"},
    {id: 1, login: "bbb", haslo: "BBB", wiek: 20, uczen: "", plec: "k"},
    {id: 2, login: "ccc", haslo: "CCC", wiek: 11, uczen: "", plec: "m"},
    {id: 3, login: "ddd", haslo: "DDD", wiek: 17, uczen: "checked", plec: "k"},
    {id: 4, login: "eee", haslo: "EEE", wiek: 15, uczen: "", plec: "m"},
    {id: 5, login: "q", haslo: "q", wiek: 15, uczen: "", plec: "m"}
]
var zalogowany = false
var user

////////////////
//////MAIN//////
////////////////
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/private/main.html"))
})

app.get("/main", function (req, res) {
    res.sendFile(path.join(__dirname + "/private/main.html"))
})

////////////////////
//////REGISTER//////
////////////////////
app.get("/register", function (req, res) {
    res.sendFile(path.join(__dirname + "/private/register.html"))
})

app.post("/register", function (req, res) {
    let powtorka = false
    for(let i = 0; i < users.length; i++){
        if(req.body.login == users[i].login){
            powtorka=true
            break
        }
    }
    if(powtorka){
        res.send("Podany uzytkownik juz istnieje")
    }else{
        let uczen
        if(req.body.uczen == undefined){
            uczen = "" 
        }else{
            uczen="checked"
        }
        users.push({id: users.length, login: req.body.login, haslo: req.body.haslo, wiek: req.body.wiek, uczen: uczen, plec: req.body.plec})
        res.send(`Dodano uczrkownika o loginie: ${req.body.login}`)
    }
})

/////////////////
//////LOGIN//////
/////////////////
app.get("/login", function (req, res) {
    res.sendFile(path.join(__dirname + "/private/login.html"))
})

app.post("/login", function (req, res) {
    for(let i = 0; i < users.length; i++){
        if(users[i].login == req.body.login && users[i].haslo == req.body.haslo){
            zalogowany = true
            user = users[i].id
            break
        }
    }
    if(zalogowany){
        res.send(`Zalogowano na konto ${req.body.login}`)
    }else{
        res.send(`Niepoprawne dane logowania`)
    }
})

/////////////////
//////ADMIN//////
/////////////////
app.get("/admin", function (req, res) {
    if(zalogowany){
        res.sendFile(path.join(__dirname + "/private/admin.html"))
    }else{
        res.sendFile(path.join(__dirname + "/private/adminNoAccess.html"))
    }
})
// app.get("/admin.html", function (req, res) {
//    res.redirect("/admin")
// })


//////////////////
//////LOGOUT//////
//////////////////
app.get("/logout", function (req, res) {
    if(zalogowany){
        zalogowany = false
        user = ""
        res.redirect("/")
    }else{
        res.redirect("/login")
    }
})
////////////////
//////SHOW//////
////////////////
app.get("/show", function (req, res) {
    if(zalogowany){
        var tabela = "<table>"
        for(let i = 0; i < users.length; i++){
            tabela+=`<tr><td>id: ${users[i].id}</td><td>user: ${users[i].login} -  ${users[i].haslo}</td><td>uczen: <input type="checkbox" name="uczen" id="uczen"${users[i].uczen} disabled></td><td>wiek: ${users[i].wiek}</td><td>plec: ${users[i].plec}</td></tr>`
        }
        tabela += "</table>"

        let strona = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="stylesheet" href="css/styleAdmin.css"><title>Admin</title></head><body><header><a href="sort">sort</a><a href="gender">gender</a><a href="show">show</a></header>${tabela}</body></html>`
        res.send(strona)
    }else{
        res.sendFile(path.join(__dirname + "/private/adminNoAccess.html"))
    }
})
////////////////
//////SORT//////
////////////////
app.get("/sort", function (req, res) {
    if(zalogowany){
        var tabela = "<table>"
        var usersTemp = users
        usersTemp.sort((a, b) => (a.wiek > b.wiek) ? 1 : -1)
        for(let i = 0; i < usersTemp.length; i++){
            tabela+=`<tr><td>id: ${usersTemp[i].id}</td><td>user: ${usersTemp[i].login} -  ${usersTemp[i].haslo}</td><td>uczen: <input type="checkbox" name="uczen" id="uczen"${usersTemp[i].uczen} disabled></td><td>wiek: ${usersTemp[i].wiek}</td><td>plec: ${usersTemp[i].plec}</td></tr>`
        }
        tabela += "</table>"
        var radio = '<form onchange="this.submit()" method="POST" action="/sort"><input type="radio" name="sort" id="asc" value="asc" checked>Rosnąco   <input type="radio" name="sort" id="dsc" value="dsc" >Malejąco</form>'
        let strona = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="stylesheet" href="css/styleAdmin.css"><title>Admin</title></head><body><header><a href="sort">sort</a><a href="gender">gender</a><a href="show">show</a></header>${radio}${tabela}</body></html>`
        res.send(strona)
    }else{
        res.sendFile(path.join(__dirname + "/private/adminNoAccess.html"))
    }
})
app.post("/sort", function (req, res) {
    if(zalogowany){
        var radioStatus = req.body.sort
        var radio
        var usersTemp = users
        if(radioStatus == "asc"){
            usersTemp.sort((a, b) => (a.wiek > b.wiek) ? 1 : -1)
            radio = '<form onchange="this.submit()" method="POST" action="/sort"><input type="radio" name="sort" id="asc"  value="asc" checked>Rosnąco   <input type="radio" name="sort" id="dsc" value="dsc">Malejąco</form>'
        }else if(radioStatus == "dsc"){
            usersTemp.sort((a, b) => (a.wiek < b.wiek) ? 1 : -1)
            radio = '<form onchange="this.submit()" method="POST" action="/sort"><input type="radio" name="sort" id="asc" value="asc" >Rosnąco   <input type="radio" name="sort" id="dsc" value="dsc" checked>Malejąco</form>'
        }

        var tabela = "<table>"
        for(let i = 0; i < usersTemp.length; i++){
            tabela+=`<tr><td>id: ${usersTemp[i].id}</td><td>user: ${usersTemp[i].login} -  ${usersTemp[i].haslo}</td><td>uczen: <input type="checkbox" name="uczen" id="uczen"${usersTemp[i].uczen} disabled></td><td>wiek: ${usersTemp[i].wiek}</td><td>plec: ${usersTemp[i].plec}</td></tr>`
        }
        tabela += "</table>"
        
        let strona = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="stylesheet" href="css/styleAdmin.css"><title>Admin</title></head><body><header><a href="sort">sort</a><a href="gender">gender</a><a href="show">show</a></header>${radio}${tabela}</body></html>`
        res.send(strona)
    }else{
        res.sendFile(path.join(__dirname + "/private/adminNoAccess.html"))
    }
})



//////////////////
//////GENDER//////
//////////////////
app.get("/gender", function (req, res) {
    if(zalogowany){
        var tabelaM = "<table>"
        var tabelaK = "<table>"
        for(let i = 0; i < users.length; i++){
            if(users[i].plec == "k")
            tabelaK+=`<tr><td class="td">id: ${users[i].id}</td><td>plec: ${users[i].plec}</td></tr>`
            else if(users[i].plec == "m")
            tabelaM+=`<tr><td class="td">id: ${users[i].id}</td><td>plec: ${users[i].plec}</td></tr>`
        }
        tabelaM += "</table>"
        tabelaK += "</table>"

        let strona = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="stylesheet" href="css/styleAdmin.css"><title>Admin</title></head><body><header><a href="sort">sort</a><a href="gender">gender</a><a href="show">show</a></header>${tabelaK}${tabelaM}</body></html>`
        res.send(strona)
    }else{
        res.sendFile(path.join(__dirname + "/private/adminNoAccess.html"))
    }
})



app.use(express.static('static'))
app.get('*', function(req, res){
    res.sendFile(path.join(__dirname + "/private/notFound.html"))
}) 
app.listen(PORT, function () { 
    console.log("to jest start serwera na porcie " + PORT )
})