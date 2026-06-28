FROM php:8.3-cli

RUN apt-get update && apt-get install -y \
    libssl-dev \
    pkg-config \
    curl \
    unzip \
    zip \
    libzip-dev \
    git \
    && docker-php-ext-install zip \
    && pecl install mongodb \
    && docker-php-ext-enable mongodb \
    && rm -rf /var/lib/apt/lists/*

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

WORKDIR /app

COPY composer.json composer.lock ./

RUN COMPOSER_ALLOW_SUPERUSER=1 composer install \
    --optimize-autoloader \
    --no-scripts \
    --no-interaction \
    --ignore-platform-reqs \
    --prefer-source

COPY . .

RUN chmod +x start.sh

CMD ["/bin/bash", "start.sh"]