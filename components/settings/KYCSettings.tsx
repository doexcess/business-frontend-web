"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { Button } from "../ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Input from "@/components/ui/Input";
import Select from "../Select";
import { Loader2, EyeIcon } from "lucide-react";
import toast from "react-hot-toast";
import { Country, State, City } from "country-state-city";
import { submitKYC } from "@/redux/slices/authSlice";
import useKYC from "@/hooks/page/useKYC";
import FileUpload from "../FileUpload";
import KYCPreview from "./KYCPreview";

const ID_TYPES = [
    "international-passport",
    "national-identity-card-nin-slip",
    "drivers-license",
    "voters-card",
    "residence-permit",
];

const KYCSettings = () => {
    const { kyc } = useKYC();
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

    if (kyc?.is_approved) {
        return (
            <KYCPreview kyc={kyc} />
        );
    }

    // Editable form
    return (
        <div className="text-black-1 dark:text-white">
            <form onSubmit={handleSubmit} className="space-y-6">
                <Card className="dark:border-gray-600">
                    <CardHeader>
                        <CardTitle>KYC Upload</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <Label>ID Type</Label>
                            <Select
                                required
                                name="id_type"
                                data={ID_TYPES}
                                value={formData.id_type || ""}
                                onChange={(e: any) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        id_type: e.target.value,
                                    }))
                                }
                            />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            <div>
                                <Label>Document Front</Label>
                                <FileUpload
                                    label="Upload Front"
                                    accept="image/*,.pdf"
                                    fileUrl={kyc?.doc_front}
                                    onUploaded={(res) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            doc_front: res.multimedia.url,
                                        }))
                                    }
                                />
                            </div>
                            <div>
                                <Label>Document Back</Label>
                                <FileUpload
                                    label="Upload Back"
                                    accept="image/*,.pdf"
                                    fileUrl={kyc?.doc_back}
                                    onUploaded={(res) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            doc_back: res.multimedia.url,
                                        }))
                                    }
                                />
                            </div>
                            <div>
                                <Label>Utility Document</Label>
                                <FileUpload
                                    label="Upload Utility"
                                    accept="image/*,.pdf"
                                    fileUrl={kyc?.utility_doc}
                                    onUploaded={(res) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            utility_doc: res.multimedia.url,
                                        }))
                                    }
                                />
                            </div>
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
