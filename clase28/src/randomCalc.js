function randomCalc (tries) {
    let inventory = {}
    for (let i = 1; i <= tries; i++ ) {
        const randomNum = Math.floor(Math.random() * 1001);
        if (inventory.hasOwnProperty(randomNum)) {
            inventory[randomNum]++;
        } else {
            inventory[randomNum] = 1;
        }
    }
    return inventory
}

process.on('message', cant => {
    if (cant) {
        let result = randomCalc(cant);
        process.send(result);
    } else {
        let result = randomCalc(2000);
        process.send(result);
    }
})