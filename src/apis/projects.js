import ajax from './ajax'

const url = '/api/projects'

const getProjects = _ => ajax({
  method: 'get',
  url
})

const deleteProject = id => ajax({
  method: 'delete',
  url: `${url}/${id}`
})

export {
  getProjects,
  deleteProject
}
