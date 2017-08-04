<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;
use App\Models\About;
use App\Http\Requests\CategoryRequest;

class AboutController extends Controller
{
    public function index(Request $request)
    {
          $user = User::findOrFail(1);
          $results = $user->about;
          
          if (!$results){
            $results = ['error'  =>  'No information found.'];
          } else {
            $results = ['data'  =>  $results];
          }

          return response()->json([
              'results'  =>  $results
          ]);
    }

    public function store(Request $request)
    {
      $about = new About;
      $about->title = $request->title;
      $about->description = $request->description;
      $about->user_id = 1;
      $about->save();
      return response()->json([
        'results'  =>  'About is added successfully.'
      ]);
    }

    public function update(Request $request, $id)
    {
        try {
          About::find($id)->update($request->all());
          return response()->json([
              'results'  =>  'About is updated successfully.'
          ]);
        } catch(Exception $e) {
            return response()->json([
                'results'  =>  'Update operation has failed.'
            ]);
        }
    }

    public function destroy($id)
    {
        try {
          About::find($id)->delete();
          return response()->json([
              'results'  =>  'About is updated successfully.'
          ]);
        } catch(Exception $e) {
            return response()->json([
                'results'  =>  'Update operation has failed.'
            ]);
        }
    }
    public function fetchCategoriesList()
    {
       $items = Category::all();
       return response()->json($items);
    }

}
