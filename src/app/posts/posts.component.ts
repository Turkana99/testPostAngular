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
  posts: any[] = []; // Postlarimizi saxlayacagimiz array
  displayPosts: any[] = []; // Pagination-da gorunecek postlari saxlayan array
  users: any[] = []; // userleri saxlayan array
  pageSize = 5; // Default sehifeye ilk girisde gorunecek post sayi

  constructor(public dialog: MatDialog, private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getUsers().subscribe((data) => {
      this.users = data; // Api-den user datasini elde etdiyimiz hisse
      // Apiden postlari elde etdiyimiz request
      this.apiService.getPosts().subscribe((response) => {
        // userId esasen postlari map edirik
        this.posts = response.map((x) => {
          // Elde etdiyimiz userId-lere esasen find metodu ile postlarimiz saxlayan arrayimize uygun userName elave etdiyimiz hisse
          x.username =
            this.users.find((user) => x.userId == user.id)?.name || '';
          return x;
        });
        // Sehife ilk acilanda paginationa esasen gorunecek datanin hesablanma alqoritmi
        this.displayPosts = this.posts.slice(
          0 * this.pageSize,
          (0 + 1) * this.pageSize
        );
      });
    });
  }

  openDialog(postId: number): void {
    const selectedPost = this.posts.find((post) => post.id === postId); // openDialog eventi ile oturulen id esasen uygun postun elde edilmesi

    const dialogRef = this.dialog.open(PostDetailsComponent, {
      width: '550px',
      data: { post: selectedPost }, // Tapilmis postun datasinin dialogumuz icerisine oturulduyu hisse
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('Dialog bağlandı:', result);
    });
  }

  onPaginatorChange(ev: any) {
    let { previousPageIndex, pageIndex, pageSize, length } = ev; // Object destructuring
    // Paginationun data ile isleme alqoritmi
    this.displayPosts = this.posts.slice(
      pageIndex * pageSize,
      (pageIndex + 1) * pageSize
    );
  }

  // Paginationa esasen ekranda gorunen datanin indeksini elde etme metodu
  getItemIndex(item: any) {
    return (
      this.posts.indexOf(
        this.posts.find((x) => JSON.stringify(x) === JSON.stringify(item))
      ) + 1
    );
  }
}
