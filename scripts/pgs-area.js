/*!
 * base on Select2 
 * edit by Song Bin  2016/8/25 for pgs
 * use $.initSelector(id,url)
 */

(function ($) {
    jQuery.extend({
        initSelector: function initSelector(selectorId,url){

                        function createOption(result){
                            var list = []
                            result.map(function(x,i){
                                var html = "<option value='" + x.id + "' title='" + x.title +"'>" + x.text + "</option>"
                                list.push(html)
                            })
                            return list
                        } 

                        function initAjax(selectId,data,url){
                            return  $.ajax({
                                            url: url,
                                            type: "POST",
                                            async:false,
                                            data: JSON.stringify(data),
                                            dataType: "json",
                                            contentType : 'application/json;charset=utf-8'
                                          })
                        }

                        function dataInit(data,valName){
                          var list = []
                          for (var i=0,l=data.length; i<l;i++){
                            var text;
                            var item = data[i]
                            if(valName === "province"){
                              text = item.province
                            }else if(valName === 'city'){
                              text = item.city
                            }else if(valName === 'district'){
                              text = item.country
                            }else{
                              console.error("初始化数据失败")
                            }

                            var pItem = {
                                id:item.areaId,
                                text:text,
                                title:valName
                              }
                            list.push(pItem)
                          }
                          return list
                        }    

                        var url = url

                        var jData = {
                            province:{
                                id:'province',
                                placeholder:'省份'
                            },
                            city:{
                                id:'city',
                                placeholder:'城市'
                            },
                            district:{
                                id:'district',
                                placeholder:'区县'
                            }
                        }

                        for(var key in jData){
                            
                            var item = jData[key]
                            var selector = "#" + selectorId + " ." + item.id
                            var id = selectorId + $(selector).attr("data-name")
                            $(selector).attr("id",id)
                            $(selector).attr("name",id)
                            $(selector).select2({
                                language:"zh-CN",
                            })
                        
                        
                            if(item.id === "province"){
                                $(selector).on("change",function(){
                                    
                                    var id = "#select2-" + this.id + "-container" 
                                    if($(id).attr('data-valid') === ""){
                                        $("#" + this.id.split("province")[0] + " .city").html('<option value="">--请选择--</option>')
                                        $("#" + this.id.split("province")[0] + " .district").html('<option value="">--请选择--</option>')
                                        return false
                                    }

                                    var pName = $(id).attr("valname")
                                    var data = {"province":pName,"areaLevel":"1","areaStatus":"1"}
                                    var pId = "#" + selectorId + " .city"
                                    initAjax(pId,data,url).done(function(result) {
                                                        result = dataInit(result,"city") 
                                                        var html = createOption(result)
                                                        var cId,dId
                                                        if(event.type === "mouseup"){
                                                            cId = "#" + event.target.id.split("-")[1].split('province')[0] + " .city"
                                                            dId = "#" + event.target.id.split("-")[1].split('province')[0] + " .district"
                                                        }else{
                                                            var $target = $(event.target.parentElement.parentElement).find("[role='tree']").attr("id")
                                                            cId = "#" + $target.split("-")[1].split('province')[0] + " .city"
                                                            dId = "#" + $target.split("-")[1].split('province')[0] + " .district"
                                                        }
                                                        $(cId).html('<option value="">--请选择--</option>')
                                                        $(dId).html('<option value="">--请选择--</option>')
                                                        $(cId).append(html)
                                        }).fail(function(jqXHR, textStatus) {
                                              console.error( "Request failed: " + textStatus );
                                        });
                                    
                                })
                            }else if( item.id === "city"){
                                $(selector).on("change",function(){
                                    var id = "#select2-" + this.id + "-container" 
                                    if( $(id).attr('data-valid') === ""){
                                        $("#" + this.id.split("city")[0] + " .district").html('<option value="">--请选择--</option>')
                                        return false
                                    } 
                                    var cName = $(id).attr("valname")
                                        id = "#select2-" + this.id.split("city")[0] + "province"  + "-container" 
                                    if( $(id).attr('data-valid') === ""){
                                        $("#" + this.id.split("city")[0] + " .district").html('<option value="">--请选择--</option>')
                                        return false
                                    }    
                                    var pName = $(id).attr("valname")    
                                    var data = {"province":pName,"city":cName,"areaLevel":"2","areaStatus":"1"}
                                    var pId = "#" + selectorId + " .city"
                                    initAjax(pId,data,url).done(function(result) {
                                                        result = dataInit(result,"district") 
                                                        var html = createOption(result)
                                                        var dId
                                                        if(event.type === "mouseup"){
                                                            dId = "#" + event.target.id.split("-")[1].split('city')[0] + " .district"
                                                        }else{
                                                            var $target = $(event.target.parentElement.parentElement).find("[role='tree']").attr("id")
                                                            dId = "#" + $target.split("-")[1].split('city')[0] + " .district"
                                                        }
                                                        $(dId).html('<option value="">--请选择--</option>')
                                                        $(dId).append(html)
                                        }).fail(function(jqXHR, textStatus) {
                                              console.error( "Request failed: " + textStatus );
                                        });
                                    
                                })
                            }
                            
                            
                        }

                        var pId = "#" + selectorId + " .province"
                        initAjax(pId,{"areaLevel":"0","areaStatus":"1"},url).done(function(result) {
                                            result = dataInit(result,"province") 
                                            var html = createOption(result)
                                            $(pId).append(html)
                                            
                        }).fail(function(jqXHR, textStatus) {
                              console.error( "Request failed: " + textStatus );
                        });
                    }
                             
    });
})(jQuery)