/* Developed by Alice Madona */
function rank(id, token, secret, x){
	console.log(x[0]);
  var rank=new Vue({
      el: "#ranking",
      data: {
          ranks: [],
          all:[],
          gid: id,
          token: token,
          group:'',
          loading: !1,
          percent:0,
          total:0,
          page:1,
          maxPages:0,
          message:'',
          ready:!1,
          since:30,
          perPage:100
      },
      mounted: function () {
          this.checkGroup();
      },
      watch:{
          gid:function() {
              this.checkGroup();
          }
      },
      updated: function () {

      },
      computed:{
          next:function(){return this.page<this.maxPages},
          back:function(){return this.page>1},
          gidClass:function(){
              var _class='form-group';
              if(this.message){
                  if(!this.ready){
                      _class+=' has-error';
                  }
              }
              return _class;
          }
      },
      methods: {
          ranking:function rankStart(){
              var self=this;
              this.reset();
              this.loading=true;
              var ranking=new Ranking(this.gid,this.token,{
					  points_per_post: x[0],
					  points_per_comment: x[1],
					  points_per_commented: x[2],
					  points_per_reaction: x[3],
					  points_per_reacted: x[4]
              });
              ranking.since(30).progress(function(completed,requests){
                  self.percent=(completed/requests*100).toFixed(2);
              }).done(function(ranks){
                  self.all=ranks;
                  self.total=self.all.length;
                  self.maxPages=Math.ceil(self.total/self.perPage);
                  self.loadPage(1);
                  $.ajax({
                    method: 'post',
                    url: 'rep.php?to=json&secret=' + secret,
                    data: { data: ranks },
					xhr: function () {
						var xhr = new window.XMLHttpRequest();
						xhr.upload.addEventListener("progress", function (e) {
							if (e.lengthComputable) {
								var percentComplete = (e.loaded || e.position) * 100 / e.total;
								$("#progress").text(percentComplete+'%').html(parseFloat(Math.round(percentComplete * 100) / 100).toFixed(2)+'%');
							}
						}, false);
							xhr.addEventListener('load',function(e){
					});
					  return xhr;
					},
					beforeSend: function () {
						$("#status").show();
                    },
                    success: function (rep) {
						$("#status").hide();
						console.log(rep);
                    }
                  });
				  // console.log(rankArray);
              });
              ranking.get();
          },
          loadPage:function(page){
              if(page){
                  this.page=page;
              }
              this.page=Math.max(1,this.page);
              var offset=(this.page-1)*this.perPage;
              this.ranks=this.all.slice(offset,offset+this.perPage);
              this.loading=false;
          },
          goNext:function(){
              this.page++;
              this.loadPage();
          },
          goBack:function(){
              this.page--;
              this.loadPage();
          },
          checkGroup:function(){
              var self=this;
              self.ready=false;
              self.message='';
              var facebook=new Facebook.Api(this.token);
              facebook.get(this.gid,function(r){
                  if(r) {
                      if(r.name){
                          self.group = r.name;
                          self.ready = true;
                      }else{
                          self.message ='Không thể xác định id nhóm (không tồn tại)';
                      }
                  }else{
                      self.message ='Không thể xác định id nhóm (không tồn tại)';
                  }
              });
          },
          reset:function(){
              this.all=[];
              this.total=0;
              this.maxPages=0;
              this.loadPage(1);
          }


      }
  });
  rank.ranking();
}
