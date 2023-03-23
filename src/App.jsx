import React, {useEffect, useState, useMemo} from 'react'
import './App.css'

const defaultStatus = {
    value: '',
    index: 0,
    list: [],
    listAllTasks: 'list',
    listPriority: ['Low','Medium','High'],
}

function checkStorage(defaultValue){
    try {
        const newValue = JSON.parse(localStorage.getItem(defaultStatus.listAllTasks))
        if (newValue === null || newValue.length === 0)  {
            return defaultValue
        }
        return newValue
    }
    catch (Error){
        return defaultValue
    }
}
function byPriority(){
    return (a, b) => defaultStatus.listPriority.indexOf(a.priority) > defaultStatus.listPriority.indexOf(b.priority) ? -1 : 1;
}

function App(){
    const [task, setTask] = useState(defaultStatus.value)
    const [priority, setPriority] = useState(defaultStatus.listPriority[defaultStatus.index])
    const [listOfTask, setListOfTask] = useState(useMemo(()=> (checkStorage(defaultStatus.list).sort(byPriority())),[]))


    function handleChangeTask(event){
        setTask(event.target.value)
    }
    function handleChangePriority(event){
        setPriority(event.target.value)
    }

    function handleSubmit(event){
        event.preventDefault()
        if (task){
            const list = checkStorage('')
            const [lastItem] = list.slice(-1)
            const newTask = {id: lastItem ? lastItem.id + 1 : 0, task: task, priority: priority}
            setListOfTask(
                [
                    ...listOfTask,
                    newTask,
                ].sort(byPriority())
            )
            localStorage.setItem(defaultStatus.listAllTasks, JSON.stringify([...list, newTask]))
            setTask(defaultStatus.value)
        }
    }

    function handleClickDelete(currentId, event){
        const newList = checkStorage([]).filter(item => item.id !== currentId)
        setListOfTask([...newList].sort(byPriority()))
        localStorage.setItem(defaultStatus.listAllTasks, JSON.stringify(newList))
    }

    function handleClickPriority(currentId, event){
        const index = defaultStatus.listPriority.indexOf(event.target.value)
        const newIndex = defaultStatus.listPriority.indexOf(event.target.value) === defaultStatus.listPriority.length - 1
            ? defaultStatus.index : index + 1
        const newList = checkStorage([]).map((element) => {
            if (element.id === currentId)   element.priority = defaultStatus.listPriority[newIndex]
            return element
        })
        setListOfTask([...newList].sort(byPriority()))
        localStorage.setItem(defaultStatus.listAllTasks, JSON.stringify(newList))
    }

    return(
        <div className={'wrapper'}>
            <h2 className={'title'}>ToDo LIST</h2>
            <Header task={task} priority={priority} handleChangeTask={handleChangeTask} handleChangePriority={handleChangePriority} onSubmit={handleSubmit}/>
            <ListOfTask list={listOfTask} onClickDelete={handleClickDelete} handleClickPriority={handleClickPriority} />
        </div>
    )
}

function Header({task, priority, handleChangeTask, handleChangePriority, onSubmit}){
    return(
        <div className={'form-task-container'}>
            <form className={'form-task'} onSubmit={onSubmit}>
                <InputTask
                    value={task}
                    placeholder={'Go!'}
                    onChange={handleChangeTask}
                />
                <div className={'container'}>
                    <SelectPriority
                        value={priority}
                        onChange={handleChangePriority}
                    />
                    <input
                        className={'form-btn'}
                        type="submit"
                        value={'Отправить'}
                    />
                </div>
            </form>
        </div>
    )
}
function InputTask({value, onChange, placeholder}){
    return(
        <textarea
            className={'form-input'}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
        />
    )
}
function SelectPriority({mainValue, onChange}){
    return(
        <select className={'select-priority'} value={mainValue} onChange={onChange}>
            {defaultStatus.listPriority.map((element) => (
                <option key={element}>{element}</option>
            ))}
        </select>
    )
}

function ListOfTask({list, onClickDelete, handleClickPriority}){
    if (list.length){
        return(
            <div className={'list-tasks-container'}>
                <ul className={'list-tasks'}>
                    {[...list].map((element)=>(
                        <Task
                            key={element.id}
                            id={element.id}
                            task={element.task}
                            priority={element.priority}
                            onClickDelete={onClickDelete}
                            onClickPriority={handleClickPriority}
                        />
                    ))}
                </ul>
            </div>
        )
    }
    return(
        <div className={'list-tasks-container'}>
            Пока что нет никаких задач
        </div>
    )
}
function Task({task, priority, id, onClickDelete, onClickPriority}){
    return(
        <li className={'task'}>
            {id}
            <div className={'task-text'}>{task}</div>
            <button
                className={'task-priority'}
                value={priority}
                onClick={(event) => onClickPriority(id, event)}
            >
                {priority.slice(0,1)}
            </button>
            <button
                className={'task-delete-button'}
                onClick={(event) => onClickDelete(id, event)}
            />
        </li>
    )
}

export default App