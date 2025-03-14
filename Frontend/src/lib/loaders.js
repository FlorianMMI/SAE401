

export async function fetchPost(post){
    let answer = await fetch('/src/lib/data/Postdata.json');
    return answer.json();
}

