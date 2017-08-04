<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable = ['name', 'description'];

    public function gods(){
        return $this->belongsToMany('App\God', 'sangrahs', 'category_id', 'god_id');
    }
}
