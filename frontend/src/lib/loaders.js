

export async function fetchPost(post){
    let answer = await fetch(`http://localhost:8080/post?page=${post}`);
    let temp = await answer.json()
    return temp.posts
}

export async function fetchBlocked(){
    let token = localStorage.getItem('token')
    let answer = await fetch(`http://localhost:8080/blocked`, {
        headers: {
            'Authorization': `Bearer ${token}` // Include the token in the Authorization header
        }
    });
    let temp = await answer.json()
    return temp
}



export async function fetchuser(id){
    let answer = await fetch(`http://localhost:8080/user/${id}`);
    let temp = await answer.json()
    
    return temp
}

export async function fetchPostId(id){
    let answer = await fetch(`http://localhost:8080/post/${id}`);
    let temp = await answer.json()
    return temp
}