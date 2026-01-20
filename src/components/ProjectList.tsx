import React, { useMemo, useState } from 'react';

import { Project, ProjectStatus, Department, Personnel } from '../types';
import { STATUS_COLORS } from '../constants';

interface ProjectListProps {
  projects: Project[];
  departments: Department[];
  personnel: Personnel[];
}

const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  departments,
  personnel,
}) => {
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>(
    'all'
  );
  const [deptFilter, setDeptFilter] = useState<string | 'all'>('all');
  const [personnelFilter, setPersonnelFilter] = useState<string | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesStatus =
        statusFilter === 'all' || project.status === statusFilter;

      const matchesDept =
        deptFilter === 'all' || project.departmentId === deptFilter;

      const matchesPersonnel =
        personnelFilter === 'all' || project.leadId === personnelFilter;

      const matchesSearch = project.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      return (
        matchesStatus &&
        matchesDept &&
        matchesPersonnel &&
        matchesSearch
      );
    });
  }, [projects, statusFilter, deptFilter, personnelFilter, searchTerm]);

  return (
    <div className="space-y-6">
      {/* FILTER BAR */}
      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        {/* SEARCH */}
        <div className="min-w-[200px] flex-1">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <i className="fa-solid fa-magnifying-glass" />
            </span>
            <input
              type="text"
              placeholder="Tìm kiếm dự án..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-slate-200 py-2 pl-10 pr-4 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* DEPARTMENT FILTER */}
        <select
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Tất cả phòng ban</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </select>

        {/* PERSONNEL FILTER */}
        <select
          value={personnelFilter}
          onChange={(e) => setPersonnelFilter(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Tất cả nhân sự</option>
          {personnel.map((person) => (
            <option key={person.id} value={person.id}>
              {person.name}
            </option>
          ))}
        </select>

        {/* STATUS FILTER */}
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as ProjectStatus | 'all')
          }
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Tất cả trạng thái</option>
          {Object.values(ProjectStatus).map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-600">
                Dự án
              </th>
              <th className="px-6 py-4 font-semibold text-slate-600">
                Phòng ban
              </th>
              <th className="px-6 py-4 font-semibold text-slate-600">
                Đầu mối chính
              </th>
              <th className="px-6 py-4 font-semibold text-slate-600">
                Ngày bắt đầu
              </th>
              <th className="px-6 py-4 font-semibold text-slate-600">
                Trạng thái
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => {
                const department = departments.find(
                  (d) => d.id === project.departmentId
                );
                const lead = personnel.find(
                  (p) => p.id === project.leadId
                );

                return (
                  <tr
                    key={project.id}
                    className="transition-colors hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">
                        {project.name}
                      </div>
                      <div className="max-w-xs truncate text-sm text-slate-500">
                        {project.description}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className="rounded px-2 py-1 text-xs font-medium"
                        style={{
                          backgroundColor: `${department?.color}20`,
                          color: department?.color,
                        }}
                      >
                        {department?.name || 'N/A'}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-slate-700">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-bold uppercase text-slate-600">
                          {lead?.name?.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-medium">
                            {lead?.name || 'N/A'}
                          </div>
                          <div className="text-xs text-slate-400">
                            {lead?.role}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-500">
                      {project.startDate}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-semibold ${STATUS_COLORS[project.status]}`}
                      >
                        {project.status}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-10 text-center text-slate-400"
                >
                  Không tìm thấy dự án nào phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectList;
