FROM php:8.3-apache

RUN pecl install mongodb && docker-php-ext-enable mongodb
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html
COPY . .

RUN composer install --no-dev --optimize-autoloader

# Let Apache listen on Railway's dynamic PORT
RUN echo "Listen \${PORT}" > /etc/apache2/ports.conf
RUN sed -i 's|<VirtualHost \*:80>|<VirtualHost *:${PORT}>|g' /etc/apache2/sites-available/000-default.conf
RUN sed -i 's|/var/www/html|/var/www/html/public|g' /etc/apache2/sites-available/000-default.conf
RUN a2enmod rewrite

CMD sed -i "s/\${PORT}/$PORT/g" /etc/apache2/ports.conf /etc/apache2/sites-available/000-default.conf && apache2-foreground