<?php

if (!defined('ABSPATH')) {
    exit;
}

function custom_storefront_setup(): void
{
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('woocommerce');
    add_theme_support('html5', ['search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script']);

    register_nav_menus([
        'primary' => __('Primary Menu', 'custom-storefront'),
        'footer' => __('Footer Menu', 'custom-storefront'),
    ]);
}
add_action('after_setup_theme', 'custom_storefront_setup');

function custom_storefront_enqueue_assets(): void
{
    wp_enqueue_style(
        'custom-storefront-style',
        get_stylesheet_uri(),
        [],
        wp_get_theme()->get('Version')
    );
}
add_action('wp_enqueue_scripts', 'custom_storefront_enqueue_assets');
