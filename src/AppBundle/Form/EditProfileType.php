<?php
namespace AppBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\NumberType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;

class EditProfileType extends AbstractType {
	public function buildForm(FormBuilderInterface $builder, array $options)
	{
		$builder
			->add('profile_realname', TextType::class, array(
				'required' => false
			))
			->add('profile_display_email', CheckboxType::class, array(
				'required' => false,
				'label' => 'Display E-mail Address'
			))
			->add('geo_latitude', NumberType::class, array(
				'required' => false
			))
			->add('geo_longitude', NumberType::class, array(
				'required' => false
			))
			->add('save', SubmitType::class, array(
				'label' => 'Save Profile'
			))
		;
	}
}