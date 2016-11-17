/**
 MIT License

 Copyright (c) 2016 Adam Jorgensen

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */
export default class {
    /**
     *
     * @param {Function} executor
     * @param {Array<String> } [proxyNames=["then", "catch"]]
     */
    constructor(executor, proxyNames=["then", "catch"]) {
        if (typeof executor !== "function") throw new TypeError("executor must be a function");
        let self = this,
            queue = [];

        function generateProxy(proxyName) {
            return function (...args) {
                queue.push([proxyName].concat(args));
                return self;
            }
        }
        for (const proxyName of proxyNames) this[proxyName] = generateProxy(proxyName);

        function generateHandler(handlerName) {
            return function (data) {
                var actualPromise = Promise[handlerName](data);
                for (const [method, ...args] of queue) actualPromise = actualPromise[method].apply(actualPromise, args);
            }
        }
        if (executor) executor(generateHandler("resolve"), generateHandler("reject"));
    }
}
