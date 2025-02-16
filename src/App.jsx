import { use, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
//  with captial letter : component
// with small letter : HTML tag
// attribute : prop
function Header(props){
  /* header sector */
    return (
      <header> 
        {/* for using props need {} */}
        <h1><a href='/' onClick={(event)=>{
          event.preventDefault(); //1. prevent default action
          props.onChangeMode();   //2. Header 의 props로 전달된 onChangeMode 가 가리키는 함수 호출
        }}>{ props.title}</a></h1> 
      </header>
    )
}
function Nav(props){
  // 배열에 아래와같이 li 태그들을 담자울수있다.
  const lis = [];

  for(let i = 0; i<props.topics.length; i++){
    let t = props.topics[i];
    lis.push(<li key={t.id}>
      <a id={t.id} href={'/read/'+t.id} onClick={event=>{
        event.preventDefault();
        props.onChangeMode(Number(event.target.id)); // a 태그에 id부여하고 해당 id를 가져오기 -> 이렇게 가져온 id를 setId를 통해 부여했기에 string값이나옴
        // 태그 속성으로 넘겼기 때문에 문자가 된다.그래서 number 로 비교하기위해 형변환해서 넘기기
      }}>{t.title}</a></li>);
  }
  return(
      <nav>
        <ol>
          {lis}
        </ol>
      </nav>
  )
}
function Article(props){
  return(
      <article>
        <h2>{props.title}</h2>
        {props.body}
      </article>
  )
}
function Create(props){
  return(
    <article>
      <h2>Create Page</h2>
      <form onSubmit={event=>{ // onSubmit : submit 버튼 클릭했을때 form태그에서 발생하는 이벤트. title, body를 입력하고 create버튼을 클릭하면 페이지가 리로드됨
      // form 태그는 submit 을 했을때 페이지가 리로드됨
      event.preventDefault();
      const title = event.target.title.value;
      const body = event.target.body.value;
      props.onCreate(title,body);

      }}>
        <p><input type='text' name="title" placeholder='title'></input></p>
        <p><textarea name='body' placeholder='body'></textarea></p>
        <p><input type='submit' value="Create Btn"></input></p>
      </form>
    </article>
  )
}
function Update(props){
  console.log('update Props : ', props)
  // props로 들어온값을 state로 변경, 그 state를 input 태그의 value값으로 변경
  //  state는 컴포넌트 안에서 변경할수있으니 onChange에서 키보드 입력할때마다 setTitle을 이용해서 새로운 값으로 지정
  // 그럼 새로운 값을 입력할때마다 title값이 바뀌고 component가 다시 랜더링 되면서 새로운 값이 value로 들어오는 과정이 반복복
  const [title, setTitle] = useState(props.title);
  const [body, setBody] = useState(props.body);
  return(
    <article>
      <h2>Update Page</h2>
      <form onSubmit={event=>{ 
            event.preventDefault();
            const title = event.target.title.value;
            const body = event.target.body.value;
            props.onUpdate(title,body);
      }}>
        <p><input type='text' name="title" placeholder='title' value={title} onChange={event=>{
          setTitle(event.target.value)
        }}></input></p>
        <p><textarea name='body' placeholder='body' value={body} onChange={event=>{
          setBody(event.target.value);
        }}></textarea></p>
        <p><input type='submit' value="Update Btn"></input></p>
      </form>
    </article>
  )
}
function App() {
  const [count, setCount] = useState(0)
  const [topicsarr, setTopicsarr] = useState([
    {id : 1, title : "html", body : "html is ..."},
    {id : 2, title : "css", body : "css is ..."},
    {id : 3, title : "javaScript", body : "javaScript is ..."},
  ])
  const [mode, setMode] = useState('WELCOME');
  const [id, setId] = useState(null); // initial value : null
  const [nextId, setNextId]= useState(4); // topicsArr last id : 3 . 
  let content = null;
  let contextControl = null;
  if(mode === 'WELCOME'){
    content = <Article title="This is Article" body="Welcome! Hello, Minjoo"></Article>
  }else if(mode === 'READ'){
    let title = null, body = null; 
    for(let i = 0; i<topicsarr.length; i++){
      // console.log("id:", id, "type:", typeof id);
      // console.log("topicsarr[i].id:", topicsarr[i].id, "type:", typeof topicsarr[i].id);
      if(topicsarr[i].id === id){
        title = topicsarr[i].title;
        body = topicsarr[i].body;
      } 
    }
    content = <Article title={title} body={body}></Article>
    contextControl = // 리액트에서 태그를 다룰때 하나의 태그안에 들어가있어야함!!
    <>
      <li><a href={'/update/'+id} onClick={event=>{
        event.preventDefault();
        setMode("UPDATE")
        }}>Update</a></li>
      <li><input type='button' value="Delete" onClick={event=>{
        // 경고창없이 그냥 삭제, button타입은 기본적동작이 없어서 preventdefault안해도됨 삭제대상은 topic데이터
        const newTopics = []
        for(let i = 0; i<topicsarr.length; i++){
          if(topicsarr[i].id !== id){
            newTopics.push(topicsarr[i]);
          }
        }
        setTopicsarr(newTopics);
        setMode("WELCOME")
      }}></input></li>
    </>  
  }else if(mode ==='CREATE'){
    content = <Create onCreate={(_title,_body)=>{
      console.log('title : ', _title, ', body : ', _body)
      const newTopic = {id: nextId, title : _title, body : _body};
      // status도 범객체라서 복사할때 그냥 push로 안되고, 새로운 복제품을 만들어서 거기다 푸시를 하고, 푸시된 복제품을 원래 status값을 변경하는거로처리
      const newTopics = [...topicsarr]
      newTopics.push(newTopic);
      setTopicsarr(newTopics);
      setMode('READ');
      setId(nextId);
      setNextId(nextId+1);
      
    }}></Create>
  }else if(mode ==='UPDATE'){
    let title = null, body = null; 
    for(let i = 0; i<topicsarr.length; i++){
      if(topicsarr[i].id === id){
        title = topicsarr[i].title;
        body = topicsarr[i].body;
      } 
    }
    content = <Update title={title} body={body} onUpdate={(_title,_body)=>{
      console.log("title : ", _title, ", body : ", _body)
      // 함수 값으로 전달받은 title, body를 기존 topics의 값을 바꾸기위해 기존 토픽스를 복제
      // 기존 topic에서 id가 일치하는 글을 찾기위해 for문을 돌리면서 찾음. 근데 newTopics가 복제된 값이라 이거로 for문 돌림
      // newTopics의 id와 현재의 id가 같다면 선택한 토픽이라서 그걸 updateTopic으로 변경 그러고 break로 반복문 빠져나오기 그리고 setTopics로 저장
      const updateTopic = {id : id, title : _title, body: _body};
      const newTpoics = [...topicsarr];
      for(let i= 0; i<newTpoics.length; i++){
          if(newTpoics[i].id === id){
            newTpoics[i] = updateTopic;
            break;
          }
      }
      setTopicsarr(newTpoics);
      setMode('READ');
    }}></Update>
  }
  return (
    <>
    <div>
      {/*  onChangeMode 라는 props 값으으로 함수를 전달 */}
      <Header title="WEB" onChangeMode={()=>{
        setMode('WELCOME');
      }}></Header>
      <Nav topics={topicsarr} onChangeMode={(_id)=>{
      {/* 내부에 선언된 topic 배열을 이렇게 {} 을 이용해서 props로 넘길수있다. 
      문자열이 아닌 json형식의 데이터로 전달하기위해 {}로 감싸야한다다 */}
        setMode('READ');
        setId(_id);
      }}></Nav> 
      {content}
      <li><a href='/create' onClick={event=>{
          event.preventDefault();
          setMode('CREATE');
      }}>Create</a></li>
      {contextControl}
    </div>
    </>
  )
}

export default App
