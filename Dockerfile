FROM registry-vpc.cn-beijing.aliyuncs.com/wutong-library/node:10.21.0-stretch as builder

RUN yarn config set registry https://registry.npm.taobao.org/ 
ADD yarn.lock /code/
ADD package.json /code/

RUN cd /code && yarn config get registry && yarn install 
ADD . /code 

RUN cd /code && ls -la  &&  yarn dist

FROM registry-vpc.cn-beijing.aliyuncs.com/wutong-library/nginx:1.19.0
COPY --from=builder /code/web /site/web
ADD nginx.config /etc/nginx/conf.d/site.conf
