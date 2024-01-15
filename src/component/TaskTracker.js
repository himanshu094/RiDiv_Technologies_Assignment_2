import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import MaterialTable from '@material-table/core';
import dayjs from 'dayjs';


export default function TaskTracker() {

  const [id,setId] = useState('')
  const [taskName,setTaskName] = useState('')
  const [date,setDate] = useState('')

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const [allTask,setAllTask] = useState({});
  const [taskArray,setTaskArray] = useState([])
  const [open,setOpen] = useState(false)
  const [status,setStatus] = useState(false)

  const getTaskData=()=>{
    const data = JSON.parse(localStorage.getItem("TaskData"));
        setAllTask(data)
        try{
        setTaskArray(Object.values(data))  
        }
        catch(e){
          console.log("no data");
        }
  }

  const handleDelete = (rowData)=>{
      
      delete(allTask[rowData.id]);
      
      localStorage.setItem('TaskData',JSON.stringify(allTask));
      alert('Data Deleted Successfully')
      getTaskData()
  }

  const handleEdit=(rowData)=>{
      setOpen(true)
      setDate(rowData.date)
      setTaskName(rowData.taskname)
      setId(rowData.id)
      setDate(rowData.date)
  }
   const handleCancel = ()=>{
    setOpen(false)
   }

   const handleUpdate=()=>{
    var   body={...allTask,
                [id]:{id:id,
                    taskname:taskName,
                    date:date,
                  status:'incomplete'}
              }
  
    localStorage.setItem('TaskData',JSON.stringify(body));
    alert('Data Updated Successfully')
    setId('')
    setTaskName('')
    setDate('0000-00-00')
    setOpen(false)
    getTaskData()
  }

  const handleRadio=(value,rowData)=>{
    var   body={...allTask,
                [rowData.id]:{id:rowData.id,
                    taskname:rowData.taskname,
                    date:rowData.date,
                  status:value}
              }
  
    localStorage.setItem('TaskData',JSON.stringify(body));

    alert('Data Updated Successfully')
    getTaskData()
  }

  function ShowTodoDialog (){
    return(
      <Dialog open={open}>
        <DialogTitle >
          Update Task
        </DialogTitle>
        <DialogContent>
              <Grid item xs={12} style={{marginBottom:8}}>
                <TextField label='Enter ID' disabled fullWidth value={id} onChange={(e)=>setId(e.target.value)}/>
              </Grid>
              <Grid item xs={12}>
                <TextField label='Enter Task'  fullWidth value={taskName} onChange={(e)=>setTaskName(e.target.value)}/>
              </Grid>

              <Grid item xs={12}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker', 'DatePicker']}>        
                          <DatePicker
                            label="Current Date"
                            format="DD-MM-YYYY"
                            slotProps={{
                              textField: {
                                helperText: 'YYYY/MM/DD',
                              },
                            }}
                            onChange={handleDate} 
                            defaultValue={dayjs(date)}     
                          />
                    </DemoContainer>
                </LocalizationProvider>
              </Grid>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleUpdate}>Update</Button>
          <Button onClick={handleCancel} >Close</Button>
        </DialogActions>
      </Dialog>
    )
  }

  function DisplayAllTasks(){
    return(<>
      <MaterialTable
      style={{ boxShadow:"0 0 15px #222"}}
      title="Incomplete Task List"
      columns={[
        { title: 'Id', field: 'id' },
        { title: 'Task Name', field:'taskname'},
        { title: 'Date', field:'date'},
        { title: 'Status', render:(rowData)=><>
              <FormControl>             
            <RadioGroup row value={rowData.status}>
                <FormControlLabel value="completed" control={<Radio />} label="Completed" 
                  onChange={(e)=>handleRadio(e.target.value,rowData)}/> 
                <FormControlLabel value="incomplete" control={<Radio />} label="Incomplete" 
                  onChange={(e)=>handleRadio(e.target.value,rowData)}/> 
            </RadioGroup>
          </FormControl>
        </>}
      ]}
      data={taskArray.filter((item)=>{
         return (item.status=='incomplete')
      })}        
      actions={[
        {
          icon: 'edit',
          tooltip: 'Edit Table',
          onClick:  (event, rowData) => handleEdit(rowData)
        },
        {
          icon: 'delete',
          tooltip: 'Delete Table',
          onClick: (event, rowData) => handleDelete(rowData)
        }, 
      ]}
      options={{
        paging:true,
        pageSize:3,       // make initial page size
        emptyRowsWhenPaging: false,   // To avoid of having empty rows
        pageSizeOptions:[3,5,7],    // rows selection options
      }} 
    />

    <MaterialTable
      style={{marginTop:20, boxShadow:"0 0 15px #222"}}
      title="Completed Task List"
      columns={[
        { title: 'Id', field: 'id' },
        { title: 'Task Name', field:'taskname'},
        { title: 'Date', field:'date'},
        { title: 'Status', render:(rowData)=><>
              <FormControl>             
            <RadioGroup row value={rowData.status}>
                <FormControlLabel value="completed" control={<Radio />} label="Completed" 
                  onChange={(e)=>handleRadio(e.target.value,rowData)}/> 
                <FormControlLabel value="incomplete" control={<Radio />} label="Incomplete" 
                  onChange={(e)=>handleRadio(e.target.value,rowData)}/> 
            </RadioGroup>
          </FormControl>
        </>}
      ]}
      data={taskArray.filter((item)=>{
         return (item.status=='completed')
      })}        
      actions={[
        {
          icon: 'edit',
          tooltip: 'Edit Task',
          onClick:  (event, rowData) => handleEdit(rowData)
        },
        {
          icon: 'delete',
          tooltip: 'Delete Task',
          onClick: (event, rowData) => handleDelete(rowData)
        },
        
      ]}
      options={{
        paging:true,
        pageSize:3,       // make initial page size
        emptyRowsWhenPaging: false,   // To avoid of having empty rows
        pageSizeOptions:[3,5,10],    // rows selection options
      }} 
    />

    </>)
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const handleDate=(event)=>{
    const m=String(Number(event.$M)+1);
    const d=String(event.$D);
    const y=String(event.$y);
    setDate(y+"-"+m+"-"+d);   
  }

  const handleSubmit=()=>{
    var   body={...allTask,
                [id]:{id:id,
                    taskname:taskName,
                    date:date,
                    status:'incomplete'}
              }
  
    console.log(body);
    localStorage.setItem('TaskData',JSON.stringify(body));
    alert('Data Submitted Successfully')
    setId('')
    setTaskName('')
    setDate('0000-00-00')
    getTaskData()
  }

  useEffect(() => {
    getTaskData();
  }, [])

  return (
    <div style={{display:'flex',justifyContent:'center'}}>
      <div style={{width:'70%',margin:10}}>
        <Grid container spacing={2} style={{alignItems:'center'}}>

          <Grid item xs={3}>
            <TextField label='Enter Task No' value={id}  fullWidth onChange={(e)=>setId(e.target.value)}/>
          </Grid>
          <Grid item xs={9}>
            <TextField label='Enter Task Name' value={taskName}  fullWidth onChange={(e)=>setTaskName(e.target.value)}/>
          </Grid>

          <Grid item xs={6}>
             <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker', 'DatePicker']}>        
                      <DatePicker
                        label="Date"
                        format="DD-MM-YYYY"
                        slotProps={{
                          textField: {
                            helperText: 'YYYY/MM/DD',
                          },
                        }}
                        onChange={handleDate} 
                        defaultValue={dayjs(date)}     
                      />
                 </DemoContainer>
             </LocalizationProvider>
          </Grid>
        
          <Grid item xs={6}></Grid>

          <Grid item xs={12}>
            <Button variant="contained"  fullWidth onClick={handleSubmit}>
              Submit
            </Button>
          </Grid>

          <Grid item xs={12}>
            {DisplayAllTasks()}
            {ShowTodoDialog()}
          </Grid>
          
        </Grid>
      </div>
    </div>
  )
}
