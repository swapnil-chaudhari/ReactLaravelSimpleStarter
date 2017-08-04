<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class God extends Model
{
    protected $fillable = ['name', 'description'];

    public function categories(){
        return $this->belongsToMany('App\Category', 'sangrahs', 'god_id', 'category_id');
    }
}
