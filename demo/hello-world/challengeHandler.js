const axios = require('axios');
const { ValidateRecipes, ValidatePets } = require("./validate");

let response;

exports.getPetsTotalPrice = async (event, context) => {
    
    const data = JSON.parse(event.body);

    const valid = ValidatePets(data);
    if(!valid){
        return {'statusCode': 400,
        'body': JSON.stringify({
            message: "invalid JSON format",
        })}
    }

    let baseUrl = data.baseUrl;
    let type = data.myPets[0].uuid;
    let response = await axios.get(baseUrl + "/pets",  { params: {type: type}});

    let price = 0;
    response.data.forEach(function(e) {price += e.price});
    try {
        response = {
            'statusCode': 200,
            'body': JSON.stringify({
                message: price,
            })
        }
    } catch (err) {
        console.log(err);
        return err;
    }

    return response
};

exports.getRecipes = async (event, context) => {
    const data = JSON.parse(event.body);

    const valid = ValidateRecipes(data);
    if(!valid){
        return {'statusCode': 400,
        'body': JSON.stringify({
            message: "invalid JSON format",
        })}
    }

    const fs = require("fs");

    let records = "id, type, name, ppu, batters, toppings \r\n";
    data.recipes.forEach(function(e) {
        let toppings = e.topping.map(x => x.type).join(" | ");
        records += e.id +","+ e.type+","+ e.name+","+ e.ppu+","+ e.batters.batter[0].type+","+ toppings + "\r\n";
    });

    fs.writeFileSync("/tmp/file.csv", records);

    let base64 = new Buffer(fs.readFileSync("/tmp/file.csv")).toString("base64");
    try {
        response = {
            'statusCode': 200,
            'body': JSON.stringify({
                message: base64,
            })
        }
    } catch (err) {
        console.log(err);
        return err;
    }

    return response
};

