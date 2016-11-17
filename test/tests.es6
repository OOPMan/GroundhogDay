import Promise from "../src/groundhogday";
import test from "unit.js";

describe("GroundhogDay Promise", function () {
    it("handles basic setInterval usage", function (done) {
        var ticks = 0,
            id = null;

        let p = new Promise(function (resolve, reject) {
            id = setInterval(resolve, 100);
        }).then(function () {
            if(++ticks == 3) {
                test.number(ticks).is(3);
                clearInterval(id);
                done();
            }
        });
    });
});