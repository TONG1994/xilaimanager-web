/**
 *   Create by Malson on 2018/8/15
 */

let getTemplate = function (info={}) {
  let { html,title,userName,publishDate } = info;
  let name = `<title>${title}</title>`;
  let style = "<style>*{margin: 0;padding: 0} html,body{height: 100%;margin: 0;padding: 0;overflow: auto;background-color: #f1f1f1;} .news-wrap{font-size: 14px;font-family: 'Raleway';box-sizing: border-box; width: 1000px;max-width: 100%; min-height: 100%;padding: 30px 30px;overflow: hidden;margin: 0 auto;background: #ffffff;} .news-wrap ol,.news-wrap ul{margin-left: 20px} .news-wrap p{margin-bottom: 10px;line-height: normal;letter-spacing: 1px} .news-wrap .image-wrap{text-align: center} .news-wrap blockquote{background-color: #ccc;padding-left: 10px;padding-right:10px;border-left: 2px solid #999;} .news-wrap .image-wrap img{width: 100%!important;height: auto!important;}</style>";
  let titleHtml = `<div style='font-size: 22px'>${title}</div><div style="color: #999999;font-size: 12px;margin: 10px 0 18px">作者：${userName}</div>`;
  let template = `<!DOCTYPE html><html lang=en><head>${name}<meta charset=UTF-8><meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no">${style}</head><body><div class='news-wrap'>${titleHtml}${html}</div></body></html>`;
  return template;
};
export default getTemplate;