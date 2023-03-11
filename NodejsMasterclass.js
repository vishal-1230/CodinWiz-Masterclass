import express from 'express';
import bcrypt from 'bcrypt'
// import userData from './userData.json'
import fs from 'fs'

const app = express()
app.use(express.urlencoded({extended: false}))
app.use(express.json())


app.post("/signup", async (req, res)=>{
    const name = req.body.name
    const emailid = req.body.email
    const username = req.body.username
    const password = req.body.password

    const encryptedPassword = await bcrypt.hash(password, 10)
    const existingData = JSON.parse(await fs.readFileSync("./userData.json"))
    existingData.push({
        name: name,
        emailid: emailid,
        username: username,
        password: encryptedPassword
    })
    console.log(existingData)

    fs.writeFileSync("./userData.json", JSON.stringify(existingData))
    res.json("Successfully added the user")
})

app.post('/login', async(req, res)=>{
    const username = req.body.username
    const password = req.body.password

    const userData = JSON.parse(await fs.readFileSync('./userData.json'))
    console.log(userData)
    let loggedIn= false
    for (let i =0; i<userData.length; i++){
        if (userData[i].username==username && bcrypt.compareSync(password, userData[i].password)){
            loggedIn=true
            break;
        }else{
            false
        }
    }

    if (loggedIn){
        console.log("Logged In")
        res.send("Logged In Successfully!!!")
    }else{
        console.log("Wrong Username or Password")
        res.send("Wrong Username or Password")
    }
    // if (correctUsername & correctPassword){
    //     res.send("Successfully Logged In")
    // }else if(correctUsername){
    //     res.send("Wrong Password")
    // }else{
    //     res.send("User Doesn't Exist")
    // }

    
})

app.listen(8000, ()=>{
    console.log('Server Connected')
})