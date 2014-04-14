define(['hbs/handlebars'], function(Handlebars) {
    function commanator(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    Handlebars.registerHelper('commanator', commanator);

    return commanator;
});