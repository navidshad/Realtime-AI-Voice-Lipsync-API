FROM nginx:1.27
LABEL authors="ikr"

RUN apt-get update && apt-get install -y tini

WORKDIR /app
COPY nginx ./

ENTRYPOINT ["tini", "-g", "-v", "--"]
CMD ["./entrypoint.sh"]
