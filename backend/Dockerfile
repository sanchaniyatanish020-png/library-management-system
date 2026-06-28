FROM php:8.3-apache

RUN pecl install mongodb && docker-php-ext-enable mongodb
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html
COPY . .

RUN composer install --no-dev --optimize-autoloader

RUN sed -i 's|/var/www/html|/var/www/html/public|g' /etc/apache2/sites-available/000-default.conf
RUN a2enmod rewrite

EXPOSE 8080
ENV PORT=8080

COPY start.sh /start.sh
RUN chmod +x /start.sh

CMD ["/start.sh"]