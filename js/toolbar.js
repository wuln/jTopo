

// 页面工具栏
function showJTopoToobar(stage){
    var toobarDiv = $('<div class="jtopo_toolbar">').html(''
    // +'<input type="radio" name="modeRadio" value="normal" checked id="r1"/>'
    +'<label for=""> 鼠标选项：</label>'
    +'&nbsp;<input type="radio" name="modeRadio" value="drag" id="r3"/><label for="r3"> 拖动画布</label>'
    +'&nbsp;<input type="radio" name="modeRadio" value="select" id="r2"/><label for="r2"> 框选元素</label>'
    +'&nbsp;<input type="radio" name="modeRadio" value="normal" id="r4"/><label for="r4"> 添加节点连线</label>'
    +'&nbsp;&nbsp;<select name="linestyle" id="linestyle" class="form-control">'
    +'<option value="defaultline">连线样式（默认样式）</option><option value="simpleline">简单连线</option>'
    +'<option value="polyline">折线</option><option value="dbpolyline">二次折线</option><option value="curve">曲线</option>'    
    +'</select>&nbsp;&nbsp;'
    //+'<input type="button" id="fullScreenButton" value="全屏显示"/>'
    +'<input type="button" class="btn" id="zoomOutButton" value=" 放 大 " />&nbsp;&nbsp;'
    +'<input type="button" class="btn" id="zoomInButton" value=" 缩 小 " />&nbsp;&nbsp;'
    //+'&nbsp;&nbsp;<input type="text" id="findText" style="width: 100px;" value="" onkeydown="enterPressHandler(event)">'
    //+ '<input type="button" id="findButton" value=" 查 询 ">'
    // + '&nbsp;&nbsp;<input type="button" id="cloneButton" value="选中克隆">&nbsp;&nbsp;'
    +'&nbsp;&nbsp;<input type="button" class="btn btn-info" id="exportButton" value="导出PNG">&nbsp;&nbsp;'
    +'&nbsp;&nbsp;<input type="checkbox" id="zoomCheckbox"/><label for="zoomCheckbox">鼠标缩放</label>'
    //+ '&nbsp;&nbsp;<input type="button" id="printButton" value="导出PDF">'
    );

    $('#content').prepend(toobarDiv);

    // 工具栏按钮处理
    $("input[name='modeRadio']").click(function(){
        stage.mode = $("input[name='modeRadio']:checked").val();      
    });
    $('#centerButton').click(function(){
        stage.centerAndZoom(); //缩放并居中显示
    });
    $('#zoomOutButton').click(function(){
        stage.zoomOut();
    });
    $('#zoomInButton').click(function(){
        stage.zoomIn();
    });
    $('#cloneButton').click(function(){
        stage.saveImageInfo();
    });
    $('#exportButton').click(function() {
        stage.saveImageInfo();
    });
    $('#printButton').click(function() {
        stage.saveImageInfo();
    });
    $('#zoomCheckbox').click(function(){
        if($('#zoomCheckbox').is(':checked')){
            stage.wheelZoom = 1.2; // 设置鼠标缩放比例
        }else{
            stage.wheelZoom = null; // 取消鼠标缩放比例
        }
    });
    
}

