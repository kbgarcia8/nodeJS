import bcrypt from "bcryptjs";
const saltRounds = 10;


const passwords = [
    'Passw0rd!1',
    'MySecret#42',
    'C0d3This@2025',
    'MoonLight$7',
    'EliotRocks123!',
    'TechTime*88',
    'Gr8Job#Now',
    'FlyHigh!2025',
    'QueenBee#77',
    'DevJake2025@',
]

passwords.forEach((password) => {
    bcrypt.hash(password, saltRounds, function(err, hash) {
        console.log(hash);
    });
})
