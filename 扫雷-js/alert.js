$(document).ready(function() {
    $("#btn").click(function() {
        $("#choiceWindow").slideDown(300);
        $("#backGround").show();

    });

    $("#x").click(function() {
        $("#choiceWindow").slideUp(300);
        $("#backGround").hide();
    })

});