// Assertion tools
var expect = require('chai').expect;

var Json2Csv = require('../libs/converters/JsonToCsvConverter');
var user = require("./user");

var row1 = {
    name: "na",
    surname: "su",
    address: {
        street: "st",
        number: "nu",
        nested: {
            c: 3,
            d: 4,
            nested: {
                e: 5
            }
        },
        nestedSimpleArr: [1, 2, 3],
        nestedComplexArr: [{
            a: 0
        }, {
            b: 1
        }]
    },
    children: [{
        age: 11
    }, {
        age: 16
    }],
    colors: ["yellow", "red"]

};

var row2 = {
    name: "na",
    surname: "su",
    address: {
        street: "st st st",
        number: "nu",
        nested: null,
        nestedSimpleArr: [1, 2, 3],
        nestedComplexArr: [{
            a: 0
        }, {
            b: 1
        }]
    },
    children: [{
        age: 11
    }, {
        age: 16
    }]
};


var expectedOutputFields = "address.nested;address.nested.c;address.nested.d;address.nested.nested.e;address.nestedComplexArr;address.nestedSimpleArr;address.number;address.street;children;colors;name;surname";
var expectedOutputRow1 = ";3;4;5;Array(2);1-2-3;nu;st;Array(2);yellow-red;na;su";
var expectedOutputRow2 = "null;;;;Array(2);1-2-3;nu;st st st;Array(2);;na;su";

describe('JsonToCsvConverter', function () {
    describe('json to csv conversion', function () {
        it('should convert sample data', function (done) {
            var j2c = new Json2Csv({
                fieldSeparator: ";",
                listSeparator: "-",
                memberSeparator: "."
            });

            var res = j2c.convert([row1, row2]);
            console.log(res);
            expect(res).to.be.a("string");
            expect(res).to.equal(expectedOutputFields + "\n" + expectedOutputRow1+ "\n" + expectedOutputRow2);
            done();
        });


    });
});


