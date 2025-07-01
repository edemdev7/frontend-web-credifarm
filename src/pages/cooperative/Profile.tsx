import React, { FC, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Building2, Phone, Hash, Users, Wheat, Calendar, FileText, Edit, Eye, Loader, Landmark } from 'lucide-react';
import { ICooperative } from '../../components/types/cooperative';
import { getCooperativeProfile, updateCooperativeProfile } from '../../api/services/cooperative/cooperativeService';
import * as Enums from '../../utils/enums';
import { Input, Select, SelectItem } from "@heroui/react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-hot-toast";
import axios from 'axios';

interface ProfileFormData {
  name: string;
  acronym: string;
  registrationNumber: string;
  headquarters: string;
  phone: string;
  mainCrop: number;
  secondaryCrops: number[];
  assets: number[];
}

interface InfoCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function InfoCard({ icon, label, value }: InfoCardProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 flex items-start gap-4 hover:bg-gray-100 transition-colors">
      <div className="flex-shrink-0 mt-1">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-600 font-medium">{label}</p>
        <p className="text-gray-900 font-medium">{value || 'Non spécifié'}</p>
      </div>
    </div>
  );
}

interface DocumentCardProps {
  icon: React.ReactNode;
  label: string;
  onView: () => void;
  emptyContent: boolean;
}

function DocumentCard({ icon, label, onView, emptyContent }: DocumentCardProps) {
  return (
    <div className={`border border-gray-200 rounded-lg p-4 flex items-center justify-between gap-4 transition-colors ${emptyContent ? 'bg-gray-50' : 'hover:bg-gray-50 cursor-pointer'}`}>
      <div className="flex items-center gap-4">
        {icon}
        <span className="text-gray-700">{label}</span>
      </div>
      {emptyContent ? (
        <span className="text-sm text-gray-500 italic">Non fourni</span>
      ) : (
        <button
          onClick={onView}
          className="text-green-600 hover:text-green-700 p-2 rounded-full hover:bg-green-50"
          aria-label={`Voir ${label}`}
        >
          <Eye size={18} />
        </button>
      )}
    </div>
  );
}

interface DocumentUploadFieldProps {
  label: string;
  onFileChange: (file: File) => void;
  currentFile?: string | null;
}


function DocumentUploadField({ label, onFileChange, currentFile }: DocumentUploadFieldProps) {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      onFileChange(selectedFile);
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex justify-between items-center mb-2">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        {currentFile && (
          <button 
            type="button"
            onClick={() => handleViewDocument(currentFile) }
            className="text-green-600 text-sm hover:underline flex items-center gap-1"
          >
            <Eye size={14} /> Voir le document actuel
          </button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileChange}
          className="hidden"
          id={`file-${label}`}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50"
        >
          Choisir un fichier
        </button>
        <span className="text-sm text-gray-600">
          {file ? file.name : 'Aucun fichier choisi'}
        </span>
      </div>
      <p className="text-xs text-gray-500 mt-1">Formats acceptés: PDF, JPEG, PNG (max 5MB)</p>
    </div>
  );
}

const handleViewDocument = async (documentUrl: string) => {
  if (!documentUrl) return;
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('accessToken')?.substring(3);
  try {
    const response = await axios.get(`${apiUrl}${documentUrl}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: 'blob',
    });
    // Create a URL for the file blob
    const fileUrl = window.URL.createObjectURL(new Blob([response.data as Blob]));
    // Open the file in a new tab
    const popup = window.open('', '_blank', 'width=800,height=600');
    if (popup) {
      popup.document.write(`
            <iframe src="${fileUrl}" width="100%" height="100%" style="border: none;"></iframe>
      `);
      popup.document.close();
    } else {
      alert('Popup bloqué. Veuillez autoriser les popups pour ce site.');
    }
  } catch (error) {
    console.error('Error fetching document:', error);
    alert('Failed to fetch document. Please try again.');
  }
};

const DocumentsSection: FC<{ cooperative: ICooperative, setIsEditingDocuments: (value: boolean) => void }> = ({ cooperative, setIsEditingDocuments }) => {

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Documents</h2>
        <button
          onClick={() => setIsEditingDocuments(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors"
        >
          <Edit size={18} />
          <span className="hidden sm:inline">Modifier les documents</span>
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DocumentCard
          icon={<FileText className="text-green-600" />}
          label="Registre d'enregistrement"
          onView={() => handleViewDocument(cooperative.RCCMDocumentUrl)}
          emptyContent={!cooperative.RCCMDocumentUrl}
        />
        <DocumentCard
          icon={<FileText className="text-green-600" />}
          label="DFE"
          onView={() => handleViewDocument(cooperative.DFEDocumentUrl)}
          emptyContent={!cooperative.DFEDocumentUrl}
        />
        <DocumentCard
          icon={<FileText className="text-green-600" />}
          label="Registre des membres"
          onView={() => handleViewDocument(cooperative.MembershipRegisterDocumentUrl)}
          emptyContent={!cooperative.MembershipRegisterDocumentUrl}
        />
        <DocumentCard
          icon={<FileText className="text-green-600" />}
          label="Bilans des 3 dernières années"
          onView={() => handleViewDocument(cooperative.threeYearBalanceSheetDocumentUrl)}
          emptyContent={!cooperative.threeYearBalanceSheetDocumentUrl}
        />
      </div>
    </div>
  );
};


const DocumentsEditSection: FC<{ cooperative: ICooperative, setIsEditingDocuments: (value: boolean) => void, fetchCooperativeProfile: () => void }> = ({ cooperative, setIsEditingDocuments, fetchCooperativeProfile }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleDocumentUpdate = async (documentType: string, file: File | null) => {
    if (!file) return;
    // Validate file size
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setUploadError('La taille du fichier dépasse la limite de 5MB.');
      toast.error('Fichier trop volumineux.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);
      setUploadError(null);
      setSuccessMessage(null);

      const token = localStorage.getItem('accessToken')?.substring(3);
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/cooperative/auth/documents/${documentType}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      if (response.status !== 200) {
        setUploadError('Échec de la mise à jour du document. Veuillez réessayer.');
        toast.error('Échec de la mise à jour du document.');
        return;
      }
      setSuccessMessage('Document mis à jour avec succès.');
      toast.success('Document mis à jour avec succès.');
      fetchCooperativeProfile();
    } catch (error) {
      console.error('Error updating document:', error);
      setUploadError('Échec de la mise à jour du document. Veuillez réessayer.');
      toast.error('Échec de la mise à jour du document.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Modifier les documents</h2>
          <form className="space-y-4">
            <DocumentUploadField
              label="Registre d'enregistrement"
              onFileChange={(file) => handleDocumentUpdate('RCCM', file)}
              currentFile={cooperative.MembershipRegisterDocumentUrl}
            />
            <DocumentUploadField
              label="DFE"
              onFileChange={(file) => handleDocumentUpdate('DFE', file)}
              currentFile={cooperative.DFEDocumentUrl}
            />
            <DocumentUploadField
              label="Registre des membres"
              onFileChange={(file) => handleDocumentUpdate('MembershipRegister', file)}
              currentFile={cooperative.MembershipRegisterDocumentUrl}
            />
            <DocumentUploadField
              label="Bilans des 3 dernières années"
              onFileChange={(file) => handleDocumentUpdate('ThreeYearBalanceSheet', file)}
              currentFile={cooperative.threeYearBalanceSheetDocumentUrl}
            />

            {/* Feedback Messages */}
            {uploading && (
              <div className="flex items-center gap-2 text-green-600">
                <Loader className="animate-spin" size={18} />
                <span>Téléchargement en cours...</span>
              </div>
            )}
            {uploadError && <p className="text-red-600">{uploadError}</p>}
            {successMessage && <p className="text-green-600">{successMessage}</p>}

            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={() => setIsEditingDocuments(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 bg-gray-100 rounded-lg"
                disabled={uploading}
              >
                Fermer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};



const CooperativeProfile: FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingDocuments, setIsEditingDocuments] = useState(false);
  const [cooperative, setCooperative] = useState<ICooperative | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch cooperative profile data
  const fetchCooperativeProfile = async () => {
    try {
      setLoading(true);
      const profile = await getCooperativeProfile();
      setCooperative(profile);
      setError(null);
    } catch (err) {
      setError('Échec du chargement du profil de la coopérative');
      toast.error('Échec du chargement du profil de la coopérative');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCooperativeProfile();
  }, []);

  const { 
    control, 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting }, 
    reset,
    setValue,
    watch 
  } = useForm<ProfileFormData>({
    defaultValues: {
      name: '',
      acronym: '',
      registrationNumber: '',
      headquarters: '',
      phone: '',
      mainCrop: undefined,
      secondaryCrops: [],
      assets: [],
    }
  });

  useEffect(() => {
    if (cooperative) {
      reset({
        name: cooperative.name || '',
        acronym: cooperative.acronym || '',
        registrationNumber: cooperative.registrationNumber || '',
        headquarters: cooperative.headquarters || '',
        phone: cooperative.phone || '',
        mainCrop: cooperative.mainCrop,
        secondaryCrops: cooperative.secondaryCrops || [],
        assets: cooperative.assets || [],
      });
    }
  }, [cooperative, reset]);

  const onUpdateProfile = async (data: ProfileFormData) => {
    try {
      await updateCooperativeProfile(data);
      setCooperative(prev => ({ ...prev!, ...data }));
      setIsEditing(false);
      toast.success('Profil mis à jour avec succès');
    } catch (err) {
      toast.error('Échec de la mise à jour du profil');
    }
  };


  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <Loader className="animate-spin h-8 w-8 text-green-600" />
      <span className="ml-2">Chargement...</span>
    </div>
  );
  
  if (error) return (
    <div className="flex items-center justify-center h-screen text-red-600">
      <p>{error}</p>
      <button 
        onClick={fetchCooperativeProfile}
        className="ml-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
      >
        Réessayer
      </button>
    </div>
  );
  
  if (!cooperative) return (
    <div className="flex items-center justify-center h-screen">
      <p>Aucune donnée de coopérative trouvée</p>
    </div>
  );

  return (
    <div>
      <Helmet>
        <title>Profil | Soa</title>
      </Helmet>
      <main className="pt-[70px] pb-5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto py-12">
          <h1 className="text-2xl font-bold uppercase mb-4">PROFIL</h1>
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            {/* Header */}
            <div className="relative h-48 bg-gradient-to-r from-green-600 to-green-400">
              <div className="absolute bottom-0 left-0 right-0 px-6 py-4">
                <div className="flex justify-between items-end">
                  <div>
                    <h1 className="text-3xl font-bold text-white">{cooperative.name}</h1>
                    <p className="text-green-100">{cooperative.acronym}</p>
                  </div>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-white text-green-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-50 transition-colors"
                  >
                    <Edit size={18} />
                    <span className="hidden sm:inline">Modifier le profil</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoCard icon={<Building2 className="text-green-600" />} label="Siège social" value={cooperative.headquarters || 'Non spécifié'} />
                <InfoCard icon={<Phone className="text-green-600" />} label="Téléphone" value={cooperative.phone || 'Non spécifié'} />
                <InfoCard icon={<Hash className="text-green-600" />} label="Numéro d'enregistrement" value={cooperative.registrationNumber || 'Non spécifié'} />
                <InfoCard icon={<Users className="text-green-600" />} label="Nombre de membres" value={cooperative.memberCount?.toString() || '0'} />
                <InfoCard 
                  icon={<Wheat className="text-green-600" />} 
                  label="Culture principale des membres" 
                  value={Enums.cooperativeMainCropEnum.find(ac => ac.value === cooperative.mainCrop)?.label || 'Non spécifié'} 
                />
                <InfoCard 
                  icon={<Wheat className="text-green-600" />} 
                  label="Cultures secondaires des membres" 
                  value={cooperative.secondaryCrops?.length ? 
                    cooperative.secondaryCrops.map(crop => 
                      Enums.cooperativeSecondaryCropsEnum.find(ac => ac.value === crop)?.label
                    ).filter(Boolean).join(', ') : 'Non spécifié'} 
                />
                <InfoCard
                  icon={<Landmark className="text-green-600" />}
                  label="Patrimoine"
                  value={cooperative.assets?.length ? 
                    cooperative.assets.map(asset => 
                      Enums.assetsEnum.find(ac => ac.value === asset)?.label
                    ).filter(Boolean).join(', ') : 'Non spécifié'}
                />
                <InfoCard 
                  icon={<Calendar className="text-green-600" />} 
                  label="Date de création" 
                  value={cooperative.creationDate ? new Date(cooperative.creationDate).toLocaleDateString() : 'Non spécifié'} 
                />
              </div>

              {/* Documents Section */}
              <DocumentsSection cooperative={cooperative} setIsEditingDocuments={setIsEditingDocuments} />
            </div>
          </div>
        </div>

        {/* Edit Profile Modal */}
        {isEditing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Modifier le Profil</h2>
                <form onSubmit={handleSubmit(onUpdateProfile)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Nom de la coopérative"
                      placeholder="Entrez le nom de la coopérative"
                      {...register("name", { required: "Le nom est requis" })}
                      isInvalid={!!errors.name}
                      errorMessage={errors.name?.message}
                      fullWidth
                      className="w-full"
                    />
                    <Input
                      label="Abréviation de la coopérative"
                      placeholder="Entrez l'abréviation de la coopérative"
                      {...register("acronym", { required: "L'abréviation est requise" })}
                      isInvalid={!!errors.acronym}
                      errorMessage={errors.acronym?.message}
                      fullWidth
                      className="w-full"
                    />
                    <Input
                      label="Numéro d'enregistrement"
                      placeholder="Entrez le numéro d'enregistrement"
                      {...register("registrationNumber", { required: "Le numéro d'enregistrement est requis" })}
                      isInvalid={!!errors.registrationNumber}
                      errorMessage={errors.registrationNumber?.message}
                      fullWidth
                      className="w-full"
                    />
                    <Input
                      label="Siège social"
                      placeholder="Entrez le siège social de la coopérative"
                      {...register("headquarters", { required: "Le siège social est requis" })}
                      isInvalid={!!errors.headquarters}
                      errorMessage={errors.headquarters?.message}
                      fullWidth
                      className="w-full"
                    />
                    <Controller
                      name="mainCrop"
                      control={control}
                      rules={{ required: "La culture principale est requise" }}
                      render={({ field }) => (
                        <Select
                          label="Culture principale"
                          placeholder="Sélectionnez la culture principale"
                          selectedKeys={field.value ? [field.value.toString()] : []}
                          isInvalid={!!errors.mainCrop}
                          errorMessage={errors.mainCrop?.message}
                          className="w-full"
                          onChange={(e) => {
                            field.onChange(Number(e.target.value));
                          }}
                        >
                          {Enums.cooperativeMainCropEnum.map((option) => (
                            <SelectItem key={option.value.toString()} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </Select>
                      )}
                    />
                    <Controller
                      name="secondaryCrops"
                      control={control}
                      rules={{ required: "Les cultures secondaires sont requises" }}
                      render={({ field }) => (
                        <Select
                          label="Cultures secondaires"
                          selectionMode="multiple"
                          placeholder="Sélectionnez les cultures secondaires"
                          selectedKeys={field.value?.map(v => v.toString()) || []}
                          isInvalid={!!errors.secondaryCrops}
                          errorMessage={errors.secondaryCrops?.message}
                          className="w-full"
                          onChange={(e) => {
                            // The issue is here - we need to handle the selected values differently
                            // Get all selected values from the event
                            const selectedValues = e.target.value.split(',').map(Number);
                            field.onChange(selectedValues);
                          }}
                        >
                          {Enums.cooperativeSecondaryCropsEnum.map((option) => (
                            <SelectItem key={option.value.toString()} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </Select>
                      )}
                    />

                    <Controller
                      name="assets"
                      control={control}
                      rules={{ required: "Le patrimoine est requis" }}
                      render={({ field }) => (
                        <Select
                          label="Patrimoine"
                          selectionMode="multiple"
                          placeholder="Sélectionnez le patrimoine"
                          selectedKeys={field.value?.map(v => v.toString()) || []}
                          isInvalid={!!errors.assets}
                          errorMessage={errors.assets?.message}
                          className="w-full"
                          onChange={(e) => {
                            // Same fix for the assets field
                            const selectedValues = e.target.value.split(',').map(Number);
                            field.onChange(selectedValues);
                          }}
                        >
                          {Enums.assetsEnum.map((option) => (
                            <SelectItem key={option.value.toString()} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </Select>
                      )}
                    />
                  </div>

                  <div className="flex justify-end gap-4 mt-6">
                    <button 
                      type="button" 
                      onClick={() => setIsEditing(false)} 
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 bg-gray-100 rounded-lg"
                      disabled={isSubmitting}
                    >
                      Annuler
                    </button>
                    <button 
                      type="submit" 
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                      disabled={isSubmitting}
                    >
                      {isSubmitting && <Loader size={16} className="animate-spin" />}
                      Enregistrer les modifications
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Edit Documents Modal */}
        {isEditingDocuments && (
          <DocumentsEditSection cooperative={cooperative} setIsEditingDocuments={setIsEditingDocuments} fetchCooperativeProfile={fetchCooperativeProfile} />
        )}
      </main>
    </div>
  );
};

export default CooperativeProfile;