chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    console.log(message);
});

customBtnFound = setInterval(function () {
  addIconButton();
}, 500);

function addIconButton() {
    $btn_selector = $('.rightRail.lodestarRightRail:not(".ss-processed-class")');
    if ($btn_selector.length > 0) {
        $btn_selector.addClass("ss-processed-class");
        $("body").append(``);
    }
}

$(document).ready(function () { 
  $(document).on("click", ".test-btn", function () {
    console.log("clicked element");    
  });
});



