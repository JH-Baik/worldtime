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
        <meta name="description" content="embed code for contact me">
        <meta name="theme-color" content="null">
        <title id="main-title">Contact Me | WorldTime247.com</title>
        <link rel="canonical" href="https://worldtime247.com/contact/">
        <link rel="stylesheet" href="/css/_styles.css">
        <link rel="shortcut icon" sizes="16x16" href="/assets/favicons/android-chrome-16x16.png" type="image/png">
    </head>
    <body class="dark-mode embed">
        <main>
            <div class="card mt-3 mb-3 colored">
                <div class="card-heading mt-5 contact-me text-center">
                    <h1>Contact Me</h1>
                </div>
                <div class="card-body">
                    <form class="row" method="post" action="">
                        <div class="mb-3 mt-1 row">
                            <label class="col-sm-2 col-md-2 col-lg-3 control-label"></label>
                            <div class="col-sm-9 col-md-8 col-lg-6">
                                <div class="form-floating mb-3">
                                    <input type="text" class="form-control" id="user-name" spellcheck="false" placeholder="Optional">
                                    <label for="user-name">Your Name</label>
                                </div>
                            </div>
                        </div>
                        <div class="mb-3 mt-1 row" style="display:none">
                            <label class="col-sm-2 col-md-2 col-lg-3 control-label"></label>
                            <div class="col-sm-9 col-md-8 col-lg-6">
                                <div class="form-floating mb-3">
                                    <input id="user-phone" type="tel" name="user-phone" spellcheck="false" placeholder="Optional" value="phone number">
                                    <label for="user-phone">Your Phone Number</label>
                                </div>
                            </div>
                        </div>
                        <div class="mb-3 row">
                            <label class="col-sm-2 col-md-2 col-lg-3 control-label"></label>
                            <div class="col-sm-9 col-md-8 col-lg-6">
                                <div class="form-floating mb-3">
                                    <input type="email" class="form-control" id="email-address" spellcheck="false" placeholder="Enter a valid e-mail address" required>
                                    <label for="email-address">Email Address</label>
                                </div>
                            </div>
                        </div>
                        <div class="mb-3 row">
                            <label class="col-sm-2 col-md-2 col-lg-3 control-label"></label>
                            <div class="col-sm-9 col-md-8 col-lg-6">
                                <div class="form-floating">
                                    <textarea class="form-control" placeholder="Leave a comment here" id="comments" spellcheck="false" required></textarea>
                                    <label for="comments">Comments</label>
                                </div>
                            </div>
                        </div>
                        <div class="mb-4 mt-3 row text-center">
                            <!-- Submit success message-->
                            <div class="d-none" id="submitSuccessMessage">
                                <div class="text-center text-white mb-3">
                                    <div class="fw-bolder">Message submission successful!</div>
                                </div>
                            </div>
                            <!-- Submit error message-->
                            <div class="d-none" id="submitErrorMessage">
                                <div class="text-center text-danger mb-3">Error sending message!</div>
                            </div>
                            <div class="col-md-12">
                                <button type="submit" class="btn btn-custom btn-primary" id="btnSubmit">Send</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </main>
        <script src="/js/embed/embed_contact.js"></script>
    </body>
</html>`;
    res.send(html);
});

module.exports = router;