import { http, HttpResponse } from 'msw';
import dummy from './articlevideodummy.json';

export const articlevideohandler = [
  http.get('https://j11a301.p.ssafy.io/articles/:articleId', () => {
    return HttpResponse.json(dummy);
  }),
];