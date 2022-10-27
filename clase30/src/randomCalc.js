function randomCalc (tries) {
    const inventory = {};
    for (let i = 1; i <= tries; i++ ) {
        const randomNum = Math.floor(Math.random() * 1001);
        if (Object.keys(inventory).includes(randomNum.toString())) {
            inventory[randomNum]++;
        } else {
            inventory[randomNum] = 1;
        }
    }
    return inventory
}

process.on('message', cant => {
    const result = randomCalc(cant);
    console.log(result);
    process.send(result);
    process.exit();
})