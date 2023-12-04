import { Component, Inject, Injector } from '@angular/core';
import { ApiService } from '../api.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { PostDetailsComponent } from '../dialogs/post-details/post-details.component';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
})
export class PostsComponent {
  posts: any[] = [];
  displayPosts: any[] = [];
  users: any[] = [];
  pageSize = 5;
  constructor(public dialog: MatDialog, private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getUsers().subscribe((data) => {
      this.users = data;
      this.apiService.getPosts().subscribe((response) => {
        this.posts = response.map((x) => {
          x.username =
            this.users.find((user) => x.userId == user.id)?.name || '';
          return x;
        });
        this.displayPosts = this.posts.slice(
          0 * this.pageSize,
          (0 + 1) * this.pageSize
        );
      });
    });
  }

  openDialog(postId:number): void {
    const selectedPost = this.posts.find(post => post.id === postId);
    
    const dialogRef = this.dialog.open(PostDetailsComponent, {
      width: '550px',
      data: { post: selectedPost },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('Dialog bağlandı:', result);
    });
  }

  onPaginatorChange(ev: any) {
    let { previousPageIndex, pageIndex, pageSize, length } = ev;
    this.displayPosts = this.posts.slice(
      pageIndex * pageSize,
      (pageIndex + 1) * pageSize
    );
  }

  getItemIndex(item: any) {
    return (
      this.posts.indexOf(
        this.posts.find((x) => JSON.stringify(x) === JSON.stringify(item))
      ) + 1
    );
  }
}
