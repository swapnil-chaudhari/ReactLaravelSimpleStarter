<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Sangrah extends Model
{
    protected $fillable = ['name', 'description', 'god_id', 'category_id'];

    public function category(){
        return $this->belongsTo('App\Category');
    }

    public function god(){
        return $this->belongsTo('App\God');
    }
}
