$(document).ready(function(){
  var canvas = document.getElementById('target');
  var stage  = new JTopo.Stage(canvas);
  //显示工具栏
  showJTopoToobar(stage);
  var scene = new JTopo.Scene(stage);
  // var colors = ['0,0,255','144,238,144','255,165,0','255,0,0']; //蓝色、绿色、橙色、红色
  var currentNode = null;
  var currentLine = null;
  var currentDetail = {
    'OS': "CentOS 7",
    'RAM': "8GB",
    'cpu': "四核",
    "磁盘": "256GB"
  }
  // var currentType = '1';
  var beginNode = null;
  var tempNodeA = new JTopo.Node('tempA');
  tempNodeA.setSize(1, 1);
  var tempNodeZ = new JTopo.Node('tempZ');
  tempNodeZ.setSize(1, 1);
  var link = newLink(tempNodeA, tempNodeZ);  

  scene.mousemove(function(e){      
    tempNodeZ.setLocation(e.x, e.y);
  }); 

  $(".coms").delegate(".component", "mousedown", function(md){   
    md.preventDefault();
    var mouseX = md.pageX;
    var mouseY = md.pageY;    
    var $this = $(this);        
    var $temp = $("<div id='temp'></div>").append($this.clone());     
    $("body").append($temp);
    $temp.css({"position" : "absolute",
               "top"      : mouseY - ($temp.height()/2) + "px",
               "left"     : mouseX - ($temp.width()/2) + "px",
               "opacity"  : "0.9"}).show();
    var half_box_height = ($temp.height()/2);
    var half_box_width = ($temp.width()/2);
    var $target = $("#target");

    $(document).delegate("body", "mousemove", function(mm){
      var mm_mouseX = mm.pageX;
      var mm_mouseY = mm.pageY;
      $temp.css({"top": mm_mouseY - half_box_height + "px" ,"left" : mm_mouseX - half_box_width  + "px"});
    });

    $("body").delegate("#temp", "mouseup", function(mu){
      mu.preventDefault();
      var mu_mouseX = mu.pageX;
      var mu_mouseY = mu.pageY;
      var tar_pos = $target.position();      

      if (mu_mouseX + half_box_width > tar_pos.left &&
        mu_mouseX - half_box_width < tar_pos.left + $target.width()&&
        mu_mouseY + half_box_height > tar_pos.top &&
        mu_mouseY - half_box_height < tar_pos.top + $target.height()
        ){   
          var child = $temp.children()[0];

          var tmpnode = {
            name: child.title,
            left: parseInt($temp.css('left')) - tar_pos.left,
            top: parseInt($temp.css("top")) - tar_pos.top,
            type: child.title + '_icon.png'
          };
          addNode(tmpnode);         
        }          
      $temp.remove();
      $(document).undelegate("body", "mousemove");
      $("body").undelegate("#temp","mouseup");       
    });       
  });  

  // $(".coms .line").click(function(e){
  //   currentType = e.target.id;
  // });

  function addNode(node){
    var n = new JTopo.Node(node.name);
    n.setLocation(node.left, node.top);
    n.setImage("imgs/" + node.type);
    n.fontColor = '155,123,2';
    n.font = 'bold 12px 微软雅黑';
    scene.add(n);
    n.addEventListener('mouseup', function(e){      
      currentNode = this;
      handler(e);
    });
    n.mousedown(function(e){    
      if(e.target == null || e.target === beginNode || e.target === link){
          scene.remove(link);      
      }    
    });
  }

  function newLink(nodeA, nodeZ){   
    var linestyle = $("#linestyle").val(); 
    var l = null;
    if(linestyle == 'defaultline'){ 
      l = new JTopo.Link(nodeA, nodeZ);  
      l.lineWidth   = 3;
      l.strokeColor = '0,200,255';
      l.arrowsRadius = 12; 
      l.shadow = false;
      l.bundleGap = 20;   
    } else if (linestyle == "simpleline") {
      l = new JTopo.Link(nodeA, nodeZ);    
      l.lineWidth = 3; 
      l.dashedPattern = 5;
      l.arrowsRadius = 12; 
      l.bundleOffset = 60; 
      l.bundleGap = 20; 
      l.textOffsetY = 3; 
      l.strokeColor = '0,200,255';
    } else if (linestyle == "polyline") {
      l = new JTopo.FoldLink(nodeA, nodeZ);
      l.direction = 'horizontal';
      l.arrowsRadius = 12; 
      l.lineWidth = 3; 
      l.bundleOffset = 60; // 折线拐角处的长度
      l.bundleGap = 20; // 线条之间的间隔
      l.textOffsetY = 3; // 文本偏移量（向下3个像素）
      l.strokeColor = '255,165,0';
      l.dashedPattern = 5;
    } else if (linestyle == "dbpolyline") {
      l = new JTopo.FlexionalLink(nodeA, nodeZ);
      l.direction = 'horizontal';
      l.arrowsRadius = 12;
      l.lineWidth = 3; // 线宽
      l.offsetGap = 35;
      l.bundleGap = 15; // 线条之间的间隔
      l.textOffsetY = 10; // 文本偏移量（向下15个像素）
      l.strokeColor = '0,250,0';
      l.dashedPattern = 3; 
    } else if (linestyle == "curve") {
      l = new JTopo.CurveLink(nodeA, nodeZ);
      l.lineWidth = 3; // 线宽
      l.arrowsRadius = 12; 
      l.strokeColor = '255,0,0';
    }    
    
    return l;
  }

  function addLink(l){
    scene.add(l);
    l.addEventListener('mouseup', function (e) {
      currentLine = this;
      handlerLine(e);
    });
  }

  function handlerLine(e) {
    if (e.button == 2) {// 右键        
      //当前位置弹出菜单（div）
      $("#linemenu").css({
          top: e.pageY,
          left: e.pageX
      }).show();
    } 
  }
  function handler(e){
    if(e.button == 2){// 右键        
      //当前位置弹出菜单（div）
      $("#contextmenu").css({
          top: e.pageY,
          left: e.pageX
      }).show();
        scene.remove(link);    
    } else {
      if(e.target != null && e.target instanceof JTopo.Node && $("input[name='modeRadio']:checked").val() == "normal"){
        if(beginNode == null){
          beginNode = e.target;                
          addLink(link);
          tempNodeA.setLocation(e.x, e.y);
          tempNodeZ.setLocation(e.x, e.y);
        } else if(beginNode !== e.target){
          var endNode = e.target;
          var l = newLink(beginNode, endNode);
          addLink(l);
          beginNode = null;            
          scene.remove(link);           
        } else {
          beginNode = null;
        }
      }else{
          scene.remove(link);      
      } 
    }
  }

  stage.click(function(event){
    if(event.button == 0){
        // 关闭弹出菜单（div）
        $("#contextmenu").hide();   
        $("#linemenu").hide();      
    }
  });
  /* 节点右键菜单处理 */ 
  $("#contextmenu a").click(function(e){
    var text = $(this).text();    
    if(text == '删除该节点'){
      scene.remove(currentNode);
      currentNode = null;
    }else if(text == '撤销上一次操作'){
      currentNode.restore();
    }else if(text == '更改颜色'){
      currentNode.fillColor = JTopo.util.randomColor();
    }else if(text == '顺时针旋转'){
      currentNode.rotate += 0.5;
    }else if(text == '逆时针旋转'){
      currentNode.rotate -= 0.5;
    }else if(text == '放大'){
      currentNode.scaleX += 0.2;
      currentNode.scaleY += 0.2;
    }else if(text == '缩小'){
      currentNode.scaleX -= 0.2;
      currentNode.scaleY -= 0.2;
    }else if(text == '节点详情'){
      var detail = currentNode.detail || currentDetail;
      var li = "";
      if(detail != '' && detail != undefined){
          $.each(detail,function(key,item){
              li += "<li>"+key+" : "+item+"</li>";
          });
      }else{
          li = "<li>暂无详细参数</li>";
      }
      $("#detail").html(li);
      $("#contextmenu").hide();
      $("#detail li").attr("style","padding:6px");
      $("#detail").css({
          top: currentNode.y,
          left: currentNode.x
      }).show();
    }else if(text == '前往机器管理平台'){
      var url = currentNode.url;
      if(url != '' && url != undefined){
          window.open(url);
      }else{
          $("#detail").html("<li>接口未给出机器管理平台地址，无法跳转</li>");
          $("#contextmenu").hide();
          $("#detail li").attr("style","padding:10px");
          $("#detail").css({
              top: currentNode.y-30,
              left: currentNode.x+40
          }).show();
      }
    }else{
      currentNode.save();
    }
    $("#contextmenu").hide();    
  });

  /* 连线右键菜单处理 */ 
  $("#linemenu a").click(function(){
    var text = $(this).text();    
    if(text == '删除该连线'){
      
      scene.remove(currentLine);
      currentLine = null;
    }
    $("#linemenu").hide();
  });

});

