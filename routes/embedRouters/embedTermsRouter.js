const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    const html = `
<!DOCTYPE html>
<html lang="en" dir="ltr">
    <head>
        <meta charset="utf-8">
        <meta name="google" content="notranslate">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <meta name="copyright" content="Copyright (c) Baik">
        <meta name="author" content="Baik">
        <meta name="description" content="embed code for Terms and Conditions">
        <meta name="theme-color" content="null">
        <title id="main-title">Terms and Conditions | WorldTime247.com</title>
        <link rel="canonical" href="https://worldtime247.com/terms/">
        <link rel="shortcut icon" sizes="16x16" href="/assets/favicons/android-chrome-16x16.png" type="image/png">
    </head>
    <body class="dark-mode embed">
        <main>
            <h1>Terms and Conditions</h1>
            <p>Last Updated: December 2, 2022</p>
            <p>The following terms (hereinafter referred to as "Terms and Conditions") - which include the <a href="/privacy/">Privacy Policy</a> of this website (hereinafter referred to as "Website") - are a legally binding contractual agreement between you (hereinafter referred to as "User," "you," "your") and Baik's Corporation (hereinafter referred to as "BAIK").</p>
            <h2>TERMS AND CONDITIONS TO USE THIS WEBSITE</h2>
                <p>The contents of this Website can be shared, redistributed, embedded, and copied. All we ask is that you include a link back to this Website.</p>
                <p>The contents of this Website cannot be modified or sold without the express written permission of BAIK.</p>
                <p>BAIK is not responsible in any way for the contents of third party websites mentioned or advertised in this Website.</p>
                <p>BAIK is not liable or responsible for adverse effects resulting from the use of this Website.</p>
                <p>BAIK is not liable or responsible for the contents of websites that have a link to this Website, or for websites that use the contents of this Website.</p>
                <p>By using this Website, in any way, you agree to these Terms and Conditions.</p>
                <p>BAIK does not warrant that this Website is or will always be free from errors, interruptions, omissions or defects, or that BAIK will correct any errors, interruptions, omissions or defects. You assume all costs that may arise out of the use of this Website.</p>
                <p>In no situation will BAIK or any of its affiliates, officers, directors, employees, licensors, suppliers or distributors be liable for any direct, indirect, special, incidental, economic or consequential damages arising out of the use of this Website, even if BAIK has been advised of the possibility of such damages. Furthermore, in no situation will liability of BAIK or any of its affiliates, officers, directors, employees, licensors, suppliers or distributors exceed the amount paid by you, if any, to purchase products or services from BAIK.</p>
                <p>BAIK reserves the right to modify these Terms and Conditions at any time, for any reason and without prior notice. In such case, the modified Terms and Conditions will take effect when they are published.</p>
            <h2>Prohibited Uses And Intellectual Property</h2>
                <p>We grant you a non-transferable, non-exclusive, revocable license to access and use the Site from one device in accordance with the Terms.</p>
                <p>You shall not use the Site for unlawful or prohibited purposes. You may not use the Site in a way that may disable, damage, or interfere in the Site.</p>
                <p>All content present on the Site includes text, code, graphics, logos, sounds, images, compilation, software used on the Site (hereinafter and hereinbefore the "Content"). The Content is our property or of our contractors and protected by intellectual property laws. You agree to use all copyright and other proprietary notices or restrictions contained in the Content and you are prohibited from changing the Content.</p>
                <p>You may not publish, transmit, modify, reverse engineer, participate in the transfer, or create and sell derivative works, or in any way use any of the Content. Your enjoyment of the Site shall not entitle you to make any illegal and disallowed use of the Content, and in particular, you shall not change proprietary rights or notices in the Content. You shall use the Content only for your personal and non-commercial use. We do not grant you any licenses to our intellectual property unless allowed in this clause.</p>
            <h2>Termination and Access Restriction</h2>
                <p>We may terminate your access to the Site and its related services or any part at any time, without notice.</p>
        </main>
    </body>
</html>`;
    res.send(html);
});

module.exports = router;