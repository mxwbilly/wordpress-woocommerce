<?php
if (!defined('ABSPATH')) {
    exit;
}
?>
</main>
<footer class="site-footer">
    <div class="site">
        <?php
        wp_nav_menu([
            'theme_location' => 'footer',
            'container'      => false,
            'fallback_cb'    => false,
        ]);
        ?>
        <p class="site-copyright">
            &copy; <?php echo esc_html(date('Y')); ?> <?php bloginfo('name'); ?>
        </p>
    </div>
</footer>
<?php wp_footer(); ?>
</body>
</html>
