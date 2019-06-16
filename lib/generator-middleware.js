/*
  生成中间件函数原理
  1. 创建函数，接收一系列的中间件和初始状态
  2. 内部定义next方法，该方法主要在执行的过程检测是否执行完所有的中间件，如果没执行完则组织传给下一个中间件的状态和next方法参数
*/
module.exports = function generator (middlewares, initState) {
    initState || (initState = {});

    function next (state) {
        var middleware;

        if (!middlewares.length) {
            return state;    
        }

        middleware = middlewares.shift();
        middleware.call(state, next, state);
    };

    return next(initState);
};