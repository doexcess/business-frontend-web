"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { uploadImage } from "@/redux/slices/multimediaSlice";
import { Button } from "../ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Input from "@/components/ui/Input";
import Select from "../Select";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { Country, State, City } from "country-state-city";
import { IdType } from "@/lib/utils";
import { submitKYC } from "@/redux/slices/authSlice";
import useKYC from "@/hooks/page/useKYC";

const KYCSettings = () => {
    
    const { kyc, loading } = useKYC();
    const dispatch = useDispatch<AppDispatch>();
    const { org } = useSelector((state: RootState) => state.org);
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        doc_front: "",
        doc_back: "",
        utility_doc: "",
        location: "",
        country: "",
        state: "",
        city: "",
        id_type: "",
    });

    const [countries] = useState(Country.getAllCountries());
    const [states, setStates] = useState<any[]>([]);
    const [cities, setCities] = useState<any[]>([]);
    const [selectedCountryIso, setSelectedCountryIso] = useState("");

    // Pre-populate KYC data when available
    useEffect(() => {
        if (kyc) {
            setFormData({
                doc_front: kyc.doc_front || "",
                doc_back: kyc.doc_back || "",
                utility_doc: kyc.utility_doc || "",
                location: kyc.location || "",
                country: kyc.country || "",
                state: kyc.state || "",
                city: kyc.city || "",
                id_type: kyc.id_type || "",
            });

            if (kyc.country) {
                const selectedCountry = countries.find((c) => c.name === kyc.country);
                if (selectedCountry) {
                    setSelectedCountryIso(selectedCountry.isoCode);
                    setStates(State.getStatesOfCountry(selectedCountry.isoCode));
                }
            }

            if (kyc.state) {
                const selectedState = State.getStatesOfCountry(selectedCountryIso).find(
                    (s) => s.name === kyc.state
                );
                if (selectedState) {
                    setCities(City.getCitiesOfState(selectedCountryIso, selectedState.isoCode));
                }
            }
        }
    }, [kyc, countries, selectedCountryIso]);

    // Handle file uploads
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const fd = new FormData();
            fd.append("image", file);

            try {
                const response: any = await dispatch(uploadImage({ form_data: fd }));
                if (response.type.includes("rejected"))
                    throw new Error(response.payload.message);

                setFormData((prev) => ({
                    ...prev,
                    [field]: response.payload.multimedia.url,
                }));
                toast.success(`${field} uploaded`);
            } catch (error: any) {
                toast.error(error.message);
            }
        }
    };

    // Country → States
    const handleCountryChange = (countryName: string) => {
        const selected = countries.find((c) => c.name === countryName);
        if (!selected) return;

        setSelectedCountryIso(selected.isoCode);
        setStates(State.getStatesOfCountry(selected.isoCode));
        setCities([]);

        setFormData((prev) => ({
            ...prev,
            country: selected.name,
            state: "",
            city: "",
        }));
    };

    // State → Cities
    const handleStateChange = (stateName: string) => {
        const selected = states.find((s) => s.name === stateName);
        if (!selected) return;

        setCities(City.getCitiesOfState(selectedCountryIso, selected.isoCode));

        setFormData((prev) => ({
            ...prev,
            state: selected.name,
            city: "",
        }));
    };

    // City
    const handleCityChange = (cityName: string) => {
        setFormData((prev) => ({ ...prev, city: cityName }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsLoading(true);

            const response: any = await dispatch(
                submitKYC({ kycData: formData, businessId: org?.id ?? "" })
            );

            if (response.type.includes("fulfilled")) {
                toast.success(response.payload.message);
            } else {
                throw new Error(response.payload.message || "Failed to submit KYC");
            }
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="text-black dark:text-white">
            <form onSubmit={handleSubmit} className="space-y-6">
                <Card className="dark:border-gray-600">
                    <CardHeader>
                        <CardTitle>KYC Upload</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label>Document Front</Label>
                            <Input
                                type="file"
                                accept="image/*,application/pdf"
                                onChange={(e) => handleFileChange(e, "doc_front")}
                            />
                            {formData.doc_front && (
                                <p className="text-sm text-gray-500">Uploaded: {formData.doc_front}</p>
                            )}
                        </div>

                        <div>
                            <Label>Document Back</Label>
                            <Input
                                type="file"
                                accept="image/*,application/pdf"
                                onChange={(e) => handleFileChange(e, "doc_back")}
                            />
                            {formData.doc_back && (
                                <p className="text-sm text-gray-500">Uploaded: {formData.doc_back}</p>
                            )}
                        </div>

                        <div>
                            <Label>Utility Document</Label>
                            <Input
                                type="file"
                                accept="image/*,application/pdf"
                                onChange={(e) => handleFileChange(e, "utility_doc")}
                            />
                            {formData.utility_doc && (
                                <p className="text-sm text-gray-500">Uploaded: {formData.utility_doc}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="location">Address</Label>
                            <Input
                                required
                                type="text"
                                id="location"
                                value={formData.location}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        location: e.target.value,
                                    }))
                                }
                            />
                        </div>

                        <div>
                            <Label>Select Country</Label>
                            <Select
                                required
                                name="country"
                                data={countries.map((c) => c.name)}
                                value={formData.country}
                                onChange={(e: any) => handleCountryChange(e.target.value)}
                            />
                        </div>

                        <div>
                            <Label>Select State</Label>
                            <Select
                                required
                                name="state"
                                data={states.map((s) => s.name)}
                                value={formData.state}
                                onChange={(e: any) => handleStateChange(e.target.value)}
                            />
                        </div>

                        <div>
                            <Label>Select City</Label>
                            <Select
                                required
                                name="city"
                                data={cities.map((c) => c.name)}
                                value={formData.city}
                                onChange={(e: any) => handleCityChange(e.target.value)}
                            />
                        </div>

                        <div>
                            <Label>ID Type</Label>
                            <Select
                                required
                                name="id_type"
                                data={Object.values(IdType)}
                                value={formData.id_type || ""}
                                onChange={(e: any) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        id_type: e.target.value as IdType,
                                    }))
                                }
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Button size="sm" type="submit" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 size={20} className="animate-spin" /> &nbsp; Submitting...
                            </>
                        ) : (
                            "Submit KYC"
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default KYCSettings;
