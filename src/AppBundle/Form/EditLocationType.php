<?php
namespace AppBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\Form\Extension\Core\Type\IntegerType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;

class EditLocationType extends AbstractType {
	public function buildForm(FormBuilderInterface $builder, array $options)
	{
		$builder
			->add('name', TextType::class, array(
				'required' => true
			))
			->add('description', TextareaType::class, array(
				'required' => false,
				'label' => 'Description'
			))
			->add('geo_latitude', HiddenType::class, array(
				'required' => true
			))
			->add('geo_longitude', HiddenType::class, array(
				'required' => true
			))
			->add('radius', IntegerType::class, array(
				'required' => false,
				'label' => 'Acceptable travel distance (miles)',
			))
			->add('save', SubmitType::class, array(
				'label' => 'Save Location',
				'attr' => array(
					'class' => 'ui-btn ui-btn-a ui-corner-all'
				)
			))
		;
	}
}