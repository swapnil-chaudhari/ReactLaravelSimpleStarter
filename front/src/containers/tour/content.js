import React from 'react';
import ContentTitle from '../../components/common/ContentTitle';

const Content = () =>
<div className="content-wrapper">
    <section className="content-header">
        <ContentTitle
            title="Tour"
            subTitle="Panel" />

        <ol className="breadcrumb">
            <li><a href="#"><i className="fa fa-dashboard"></i> Home</a></li>
            <li className="active">Tour</li>
        </ol>
    </section>

  <section className="content">
    <div className="box">
      <div className="box-header">
        <table className="table">
            <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Action</th>
            </tr>
            <tr>
                <td>Title1</td>
                <td>Description1</td>
                <td>Action1</td>
            </tr>
            <tr>
                <td>Title1</td>
                <td>Description1</td>
                <td>Action1</td>
            </tr>
            <tr>
                <td>Title1</td>
                <td>Description1</td>
                <td>Action1</td>
            </tr>
            <tr>
                <td>Title1</td>
                <td>Description1</td>
                <td>Action1</td>
            </tr>
        </table>
      </div>
    </div>

  </section>
</div>

export default Content;
