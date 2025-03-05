import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const useUrlSync = (selectedOption: string, setSelectedOption: (option: string) => void) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const optionFromUrl = searchParams.get('option');
    if (optionFromUrl) {
      setSelectedOption(optionFromUrl);
    }
  }, [searchParams, setSelectedOption]);

  useEffect(() => {
    if (selectedOption) {
      navigate(`?option=${selectedOption}`, { replace: true });
    }
  }, [selectedOption, navigate]);
};