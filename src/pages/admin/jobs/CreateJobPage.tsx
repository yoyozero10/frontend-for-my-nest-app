import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateJob } from '../../../hooks/useJobs';
import { useCompanies } from '../../../hooks/useCompanies';
import { ArrowLeft, Loader2 } from 'lucide-react';
import type { CreateJobDto } from '../../../types/job';

export default function CreateJobPage() {
    const navigate = useNavigate();
    const createJob = useCreateJob();
    const { data: companiesData } = useCompanies(1, 100); // Get all companies

    const companies = companiesData?.data?.result || [];

    const [formData, setFormData] = useState<CreateJobDto>({
        name: '',
        skills: [],
        company: '',
        location: '',
        salary: 0,
        quantity: 1,
        level: 'JUNIOR',
        description: '',
        startDate: '',
        endDate: '',
        isActive: true
    });

    const [skillInput, setSkillInput] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.company || !formData.location) {
            alert('Vui lòng điền đầy đủ thông tin bắt buộc');
            return;
        }

        try {
            await createJob.mutateAsync(formData);
            alert('Tạo job thành công!');
            navigate('/admin/jobs');
        } catch (error: any) {
            alert(error?.response?.data?.message || 'Tạo job thất bại!');
        }
    };

    const addSkill = () => {
        if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
            setFormData(prev => ({
                ...prev,
                skills: [...prev.skills, skillInput.trim()]
            }));
            setSkillInput('');
        }
    };

    const removeSkill = (skill: string) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.filter(s => s !== skill)
        }));
    };

    return (
        <div>
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => navigate('/admin/jobs')}
                    className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h2 className="text-2xl font-bold text-stone-900">Create New Job</h2>
                    <p className="text-stone-600 mt-1">Thêm công việc mới vào hệ thống</p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-stone-200 p-8">
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Job Name */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                            Job Title <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                            placeholder="e.g. Senior Frontend Developer"
                            required
                        />
                    </div>

                    {/* Company */}
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                            Company <span className="text-red-600">*</span>
                        </label>
                        <select
                            value={formData.company}
                            onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                            className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                            required
                        >
                            <option value="">Select Company</option>
                            {companies.map((company: any) => (
                                <option key={company._id} value={company._id}>
                                    {company.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                            Location <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                            className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                            placeholder="e.g. Hà Nội"
                            required
                        />
                    </div>

                    {/* Level */}
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                            Level
                        </label>
                        <select
                            value={formData.level}
                            onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value }))}
                            className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                            <option value="INTERN">Intern</option>
                            <option value="FRESHER">Fresher</option>
                            <option value="JUNIOR">Junior</option>
                            <option value="MIDDLE">Middle</option>
                            <option value="SENIOR">Senior</option>
                        </select>
                    </div>

                    {/* Salary */}
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                            Salary (VNĐ)
                        </label>
                        <input
                            type="number"
                            value={formData.salary}
                            onChange={(e) => setFormData(prev => ({ ...prev, salary: Number(e.target.value) }))}
                            className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                            placeholder="e.g. 20000000"
                            min="0"
                        />
                    </div>

                    {/* Quantity */}
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                            Quantity
                        </label>
                        <input
                            type="number"
                            value={formData.quantity}
                            onChange={(e) => setFormData(prev => ({ ...prev, quantity: Number(e.target.value) }))}
                            className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                            min="1"
                        />
                    </div>

                    {/* Start Date */}
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                            Start Date
                        </label>
                        <input
                            type="date"
                            value={formData.startDate}
                            onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                            className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                    </div>

                    {/* End Date */}
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                            End Date
                        </label>
                        <input
                            type="date"
                            value={formData.endDate}
                            onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                            className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                    </div>

                    {/* Skills */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                            Skills
                        </label>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={skillInput}
                                onChange={(e) => setSkillInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                                className="flex-1 px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                placeholder="e.g. React, TypeScript"
                            />
                            <button
                                type="button"
                                onClick={addSkill}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                            >
                                Add
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.skills.map((skill) => (
                                <span
                                    key={skill}
                                    className="px-3 py-1 bg-stone-100 text-stone-700 rounded-full text-sm flex items-center gap-2"
                                >
                                    {skill}
                                    <button
                                        type="button"
                                        onClick={() => removeSkill(skill)}
                                        className="text-red-600 hover:text-red-700"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                            rows={6}
                            placeholder="Job description..."
                        />
                    </div>

                    {/* Is Active */}
                    <div className="md:col-span-2">
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={formData.isActive}
                                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                                className="w-4 h-4 text-red-600 border-stone-300 rounded focus:ring-red-500"
                            />
                            <span className="text-sm font-medium text-stone-700">Active (Hiển thị công khai)</span>
                        </label>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 mt-8 pt-6 border-t border-stone-200">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/jobs')}
                        className="px-6 py-2 border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50 font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={createJob.isPending}
                        className="px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg font-medium flex items-center gap-2"
                    >
                        {createJob.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                        {createJob.isPending ? 'Creating...' : 'Create Job'}
                    </button>
                </div>
            </form>
        </div>
    );
}
