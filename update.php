<?php 
/* Developed by Vy Nghia */
require_once ('server/config.php');

if(isset($_GET['secret']) && $_GET['secret'] == SECRET): ?>
<!DOCTYPE html>
<html lang="en" xmlns="https://www.w3.org/1999/xhtml">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Group Ranking</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-table/1.11.0/bootstrap-table.min.css" rel="stylesheet"/>
    <!--[if lt IE 9]>
    <script src="//oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
    <script src="//oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
    <style>#ranking {
        max-width: 800px;
    }
    button[disabled]+.tooltip{
        visibility: hidden;
    }
    [v-cloak] {
        display: none
    }
    </style>
</head>
<body>

<div class="container" id="ranking">
    <div v-cloak>
        <div class="row text-center">
            <div class="col-xs-12">
                <h1><a href="https://www.facebook.com/K17.VyNghia" target="_blank">
                    Nhóm: {{group}}
                </a></h1>
                <p>Có <strong>{{total}}</strong> thành viên được xếp hạng</p>
            </div>
        </div>
        <div class="row">
            <div class="col-xs-12">
                <div class="panel panel-primary">
                    <div class="panel-heading">
                        <h3 class="panel-title"><span class="glyphicon glyphicon-signal" aria-hidden="true"></span>
                            {{loading?'Đang quét... '+percent+'%':'Ranking'}} <span id="status" style="display: none">(Đang xử lý kết quả... <span id="progress">0%</span>)</span>
                            <div class="pull-right">
                                <span v-if="maxPages">{{page}}/{{maxPages}}</span>
                                <button :disabled="!back" @click="goBack" class="btn btn-default btn-xs" title="Trang trước" data-toggle="tooltip"><i class="glyphicon glyphicon-menu-left"></i></button>
                                <button :disabled="!next" @click="goNext" class="btn btn-default btn-xs" title="Trang sau" data-toggle="tooltip"><i class="glyphicon glyphicon-menu-right"></i></button>
                            </div>
                        </h3>

                    </div>
                    <div class="panel-body">
                        <div :class="gidClass">
                            <span v-if="message" class="help-block">{{message}}</span>
                        </div>

                        <div v-if="ranks.length > 0">
                            <table id="rankTable" data-toggle="table" class="table">
                                <thead>
                                <tr>
                                    <th>Rank</th>
                                    <th>Name</th>
                                    <th class="text-center">Posts</th>
                                    <th class="text-center">Points</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for="rank in ranks" :key="rank.id" :class="rank.is_mine?'bg-success':''">
                                    <td>{{rank.rank}}</td>
                                    <td>
                                        <a target="_blank" :href="'https://fb.com/'+rank.id">
                                            <img class="profile-picture"
                                                 :src="'https://graph.facebook.com/'+rank.id+'/picture?width=32'"
                                                 alt="profile-picture" width="32px" height="32px">
                                        </a>
                                        <a target="_blank" :href="'https://fb.com/'+rank.id">
                                            {{rank.name}}
                                        </a>

                                    </td>
                                    <td class="text-center">{{rank.post}}</td>
                                    <td class="text-center">{{rank.points}}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div class="panel-footer text-center">
                        Developed by Vy Nghia
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.4.0/vue.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/vue-resource/1.2.0/vue-resource.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js"></script>
<script src="api.js"></script>
<script src="rank.js"></script>
<script src="app.js"></script>
<script>
<?php echo "var points = [
'".$pnt['points_per_post']."', 
'".$pnt['points_per_comment']."', 
'".$pnt['points_per_commented']."', 
'".$pnt['points_per_reaction']."', 
'".$pnt['points_per_reacted']."'];"; ?>


<?php echo "rank('".GroupID."', '".access_token."', '".SECRET."', points);" ?>
</script>
</body>
</html>
<?php endif; ?>