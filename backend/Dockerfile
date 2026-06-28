
FROM php:8.3-cli

RUN apt-get update && apt-get install -y \
    libssl-dev \
    pkg-config \
    && pecl install mongodb \
    && docker-php-ext-enable mongodb

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app


COPY . .

RUN composer install --optimize-autoloader --no-scripts --no-interaction
EXPOSE 8000

CMD php -S 0.0.0.0:$PORT -t public