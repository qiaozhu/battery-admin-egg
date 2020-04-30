module.exports = (options, app) => {
  return async function httpLog(ctx, next) {
    // const startTime = new Date().getTime();
    ctx.logger.info('Request Header: %j', ctx.request);
    if (ctx.request.method.toUpperCase() === 'POST') {
      ctx.logger.info('Request Body: %j', ctx.request.body);
    }
    await next();
    // const endTime = new Date().getTime();
    ctx.logger.info('Response Header: %j', ctx.response);
    const contentType = ctx.response.header['content-type'] || '';
    if (contentType.indexOf('application/json') > -1) {
      ctx.logger.info('Response Body: %j', ctx.response.body);
    } else {
      ctx.logger.info('Response Body: %j', 'this response is not a JSON');
    }
  };
};
